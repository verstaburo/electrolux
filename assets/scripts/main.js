/* eslint-disable */

/**
 * REMOVE IT
 *
 * Скрипты можно писать тут, либо подключать с помощь https://github.com/coderhaoxin/gulp-file-include
 *
 * ВАЖНО: Файлы просто подключаются, без транспиляции (babel) минификации, поэтому нужно писать на ES5
 * Так же доступа к блокам, которые собираются с помощью вебпака не будет.
 */

// Валидация и отправка форм
$(document).ready(function () {

  // функция для обнуления формы
  function resetForm(formEl) {
    const form = formEl
    const selects = $(form).find('select');
    const datepickers = $('.js-datepicker');
    const mcselect = $('.js-mc-select');
    const files = $('.input-uploader [data-filename]');
    // обнуляем селекты
    $(selects).each(function (i, el) {
      el.choices.setChoiceByValue(el.defaultSelectedValue);
    });
    // обнуляем кастомный селект для мк
    if (mcselect.length > 0) {
      $(mcselect).each(function (i, el) {
        el.mcselect.reset();
      })
    }
    // очищаем поле от имени файла
    if (files.length > 0) {
      files.text('');
    }
    // дефолтный ресет для формы
    form.reset();
    // очишаем календарь
    $(datepickers).each(function (i, el) {
      $(el).datepicker().data('datepicker').clear();
    });
    // сбрасываем валидатор
    $(form).parsley().reset();
  }

  // валидация
  var Parsley = window.Parsley;

  Parsley.addMessages('ru', {
    defaultMessage: "Некорректное значение.",
    type: {
      email: "Введите адрес электронной почты.",
      url: "Введите URL адрес.",
      number: "Введите число.",
      integer: "Введите целое число.",
      digits: "Введите только цифры.",
      alphanum: "Введите буквенно-цифровое значение."
    },
    notblank: "Это поле должно быть заполнено.",
    required: "Обязательное поле.",
    pattern: "Это значение некорректно.",
    min: "Это значение должно быть не менее чем %s.",
    max: "Это значение должно быть не более чем %s.",
    range: "Это значение должно быть от %s до %s.",
    minlength: "Это значение должно содержать не менее %s символов.",
    maxlength: "Это значение должно содержать не более %s символов.",
    length: "Это значение должно содержать от %s до %s символов.",
    mincheck: "Выберите не менее %s значений.",
    maxcheck: "Выберите не более %s значений.",
    check: "Выберите от %s до %s значений.",
    equalto: "Это значение должно совпадать."
  });

  Parsley.setLocale('ru');

  $('[data-validated-form]').parsley({
    trigger: 'submit',
    errorClass: 'is-error',
    successClass: 'is-success',
    excluded: 'input[type=button], input[type=submit], input[type=reset], input[type=hidden], [disabled]',
    classHandler: function (el) {
      return $(el.element).closest('.inputbox');
    },
    errorsContainer: function (el) {
      return $(el.element).closest('.inputbox__wrapper').find('.error-message');
    },
  });

  // проверка промокода
  $(document).on('click', '.js-promocode', function (evt) {
    evt.preventDefault();
    var self = evt.currentTarget;
    var promocodeEl = $(self).closest('.promocode');
    var promocode = $(promocodeEl).find('[data-promocode-value]').val();
    if (promocode) {
      $(promocodeEl).removeClass('is-error');
      $(promocodeEl).addClass('is-success');
    } else {
      $(promocodeEl).removeClass('is-success');
      $(promocodeEl).addClass('is-error');
    }
  })

  // отправка формы записи
  $('[data-orderform]').on('submit', function (evt) {
    evt.preventDefault();
    evt.stopPropagation();
    var self = evt.currentTarget;
    var url = $(self).attr('action');
    $(self).parsley().whenValidate().done(function () {
      $.ajax({
        url: url,
        type: "POST",
        data: new FormData(self),
        processData: false,
        contentType: false,
        dataType: 'json',
        complete: function (data) {
          var formTypesArray = window.globalFunctions.getFormTypes().split(',');
          if (formTypesArray.indexOf('oven') === -1) {
            window.globalFunctions.openPopup($('#popup-reg-pay-success')[0]);
            // редирект
          } else {
            // показываем попап
            window.globalFunctions.openPopup($('#popup-registration-success')[0]);
            // очищаем форму
            resetForm(self);
          }
        }
      });
    });
  });

  // отправка формы в поддержку
  $('[data-feedback]').on('submit', function (evt) {
    evt.preventDefault();
    evt.stopPropagation();
    var self = evt.currentTarget;
    var url = $(self).attr('action');
    $(self).parsley().whenValidate().done(function () {
      $.ajax({
        url: url,
        type: "POST",
        data: new FormData(self),
        processData: false,
        contentType: false,
        dataType: 'json',
        complete: function (data) {
          window.globalFunctions.openPopup($('#popup-feedback-success')[0]);
        }
      });
    });
  });
});



// Карты
if ($('.map').length > 0) {
  ymaps.ready(function () {
    var mapMsc = new ymaps.Map('map_msc', {
      center: [55.730963, 37.646687],
      zoom: 17,
      controls: [],
    });

    var mapMscBalloonContent = {
      title: $('#map_msc').attr('data-balloon-title'),
      address: $('#map_msc').attr('data-balloon-address'),
      describe: $('#map_msc').attr('data-balloon-describe'),
    };

    var mapRh = new ymaps.Map('map_rh', {
      center: [43.672733, 40.295280],
      zoom: 17,
      controls: [],
    }, {
      searchControlProvider: 'yandex#search'
    });

    var mapRhBalloonContent = {
      title: $('#map_rh').attr('data-balloon-title'),
      address: $('#map_rh').attr('data-balloon-address'),
      describe: $('#map_rh').attr('data-balloon-describe'),
    };

    // Макет балуна
    // Создание макета балуна на основе Twitter Bootstrap.
    var BalloonLayout = ymaps.templateLayoutFactory.createClass(
      '<div class="balloon">' +
      '<div class="balloon__tail"></div>' +
      '<div class="balloon__wrapper">' +
      '$[[options.contentLayout]]' +
      '</div>' +
      '</div>');

    var BalloonContentLayout = ymaps.templateLayoutFactory.createClass(
      '<div class="balloon__content">' +
      '<div class="balloon__header"><svg class="balloon__icon"xmlns="http://www.w3.org/2000/svg" viewBox="0 0 360 512"><path d="M180,0C80.75,0,0,80.75,0,180a179.62,179.62,0,0,0,26.87,94.65L169.75,504.91A15,15,0,0,0,182.5,512h.12a15,15,0,0,0,12.75-7.29L334.61,272.22A179.78,179.78,0,0,0,360,180C360,80.75,279.25,0,180,0ZM308.87,256.82,182.27,468.19,52.37,258.85A149.79,149.79,0,0,1,29.8,180C29.8,97.29,97.29,29.8,180,29.8S330.1,97.29,330.1,180A149.9,149.9,0,0,1,308.87,256.82Z" fill="#af1930"/><path d="M180,90a90,90,0,1,0,90,90A90.1,90.1,0,0,0,180,90Zm0,150.2A60.2,60.2,0,1,1,240.1,180,60.24,60.24,0,0,1,180,240.2Z" fill="#af1930"/></svg><span class="ballon__header-text">{{properties.balloonTitle}}</span></div>' +
      '<div class="balloon__address">{{properties.balloonAddress}}</div> ' +
      '<div class="balloon__describe">{{properties.balloonDescribe}}</div>' +
      '</div>'
    );

    var placemarkMsc = new ymaps.Placemark(mapMsc.getCenter(), {
      balloonTitle: mapMscBalloonContent.title,
      balloonAddress: mapMscBalloonContent.address,
      balloonDescribe: mapMscBalloonContent.describe,
    }, {
      // Опции.
      // Необходимо указать данный тип макета.
      iconLayout: 'default#image',
      // Своё изображение иконки метки.
      iconImageHref: 'assets/images/location.png',
      // Размеры метки.
      iconImageSize: [24, 34],
      // Смещение левого верхнего угла иконки относительно
      // её "ножки" (точки привязки).
      iconImageOffset: [-12, -34],
      balloonMaxWidth: 296,
      balloonCloseButton: false,
      balloonLayout: BalloonLayout,
      balloonContentLayout: BalloonContentLayout,
      balloonPanelMaxMapArea: 219648,
      hideIconOnBalloonOpen: false,
      balloonOffset: [0, 18],
    });

    var placemarkRh = new ymaps.Placemark(mapRh.getCenter(), {
      balloonTitle: mapRhBalloonContent.title,
      balloonAddress: mapRhBalloonContent.address,
      balloonDescribe: mapRhBalloonContent.describe,
    }, {
      // Опции.
      // Необходимо указать данный тип макета.
      iconLayout: 'default#image',
      // Своё изображение иконки метки.
      iconImageHref: 'assets/images/location.png',
      // Размеры метки.
      iconImageSize: [24, 34],
      // Смещение левого верхнего угла иконки относительно
      // её "ножки" (точки привязки).
      iconImageOffset: [-12, -34],
      balloonMaxWidth: 296,
      balloonCloseButton: false,
      balloonLayout: BalloonLayout,
      balloonContentLayout: BalloonContentLayout,
      balloonPanelMaxMapArea: 219648,
      hideIconOnBalloonOpen: false,
      balloonOffset: [0, 18],
    });

    mapMsc.geoObjects.add(placemarkMsc);
    mapRh.geoObjects.add(placemarkRh);
    placemarkMsc.balloon.open();
    placemarkRh.balloon.open();
  });
}

// для фикспрайс
$(document).ready(function () {

  // установка статуса "Выполнено" при подтверждении в попапе #popup-confirm-repair
  $(document).on('click', '.js-confirm-repair', function (evt) {
    evt.preventDefault();
    var self = evt.currentTarget;
    var popup = $(self).closest('.popup')[0];
    var targetLabel = popup.popupTrigger;
    var targetCheckbox = $(targetLabel).find('input[type="checkbox"]')[0];
    targetCheckbox.checked = true;
    $(targetLabel).closest('tr').removeClass('is-paid').addClass('is-success');
    $(targetCheckbox).change();
    window.globalFunctions.closePopup();
  });
});

/* eslint-enable */
