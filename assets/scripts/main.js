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
  // экшны сервера
  const ACTION_FORM_CLEAN = "clean";
  const ACTION_NEXT_POPUP = "next";
  const ACTION_EXTERNAL_LINK = "external";
  const ACTION_CLOSE_POPUP = "close";
  const ACTION_RELOAD_PAGE = "reload";
  const ACTION_UPDATE_NODES = "update";
  // события ui
  const EVENT_FORM_CLEAN = "form.clean";
  const EVENT_BINDING_REQUIRED = "js.bind";
  const FANCYBOX_CONTENT_LOADED = "afterLoad.fb";
  $(document)
    // обработка ajax-форм
    .on('submit', 'form.js-ajax-form-fxp', onAjaxFormSubmit)
    // когда fancybox подгрузит контент - биндим на него динамику
    .on(FANCYBOX_CONTENT_LOADED, function (event, fancybox, current) {
      $(current.$content).trigger(EVENT_BINDING_REQUIRED)
    })
    // обработка события очистки формы
    .on(EVENT_FORM_CLEAN, 'form', function (e) {
      resetForm(e.currentTarget)
    })
    .on('click', 'a.js-action', function (e) {
      e.preventDefault();
      e.stopPropagation();
      asyncGetAction($(e.currentTarget).attr('href'))
    })
    .on(EVENT_BINDING_REQUIRED, function (e) {
      $(e.target)
        .find('[data-validated-form]')
        .parsley({
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
        })
    })
    .trigger(EVENT_BINDING_REQUIRED);

  /**
   * вызывается когда отправляем ajax форму на fixprice
   * @param e Event
   */
  function onAjaxFormSubmit(e) {
    e.preventDefault();
    e.stopPropagation();
    var $form = $(e.currentTarget);
    $form
      .parsley()
      .whenValidate()
      .done(function () {
        asyncSendForm($form)
      });
  }

  /**
   * отправляем данные формы на бэк
   * @param $form jQuery
   */
  function asyncSendForm($form) {
    $.ajax({
      url: $form.attr('action'),
      type: "POST",
      data: $form.serialize(),
      dataType: 'json',
      success: function (response) {
        onSuccess($form, response)
      },
      error: function (jqXHR, textStatus, errorThrown) {
        onError($form, jqXHR, textStatus, errorThrown)
      }
    });
  }

  /**
   * обработка ошибки при отправке формы через ajax
   * @param $form jQuery - отправленая форма
   * @param jqXHR jqXHR
   * @param textStatus String
   * @param errorThrown String
   */
  function onError($form, jqXHR, textStatus, errorThrown) {
    // TODO
    console.error("FORM SUBMIT ERROR", arguments)
  }

  /**
   * разбор ответа сервера после отправки формы. сервер присылает набор действия которые надо сделать в ui
   * @param json Object - успешный ответ сервера после отправки формы
   * @param $form jQuery - элемент формы
   */
  function onSuccess($form, json) {
    if (typeof json == 'object' && json.hasOwnProperty('actions')) {
      json
        .actions
        .forEach(function (action) {
          switch (action) {
            case ACTION_FORM_CLEAN:
              $form.trigger(EVENT_FORM_CLEAN);
              break;
            case ACTION_NEXT_POPUP:
              asyncLoadPopup(json.next);
              break;
            case ACTION_EXTERNAL_LINK:
              openExternalLink(json.link);
              break;
            case ACTION_CLOSE_POPUP:
              $.fancybox.close();
              break;
            case ACTION_RELOAD_PAGE:
              /**
               * перезагрузка страницы и открытие попапа кажется слишком раздражающим
               * поэтому отрезаем хеш чтобы fancybox не открывал заново попап.
               */
              document.location = document.location.href.replace(location.hash, "");
              break;
            case ACTION_UPDATE_NODES:
              /**
               * контракт обновляемых DOM элементов
               * - должен быть data-id для определения элемента
               * - должен быть data-update-url для обращения за новым куском хтмл взамен старого
               */
              $('[data-id=' + json.id + '][data-update-url]')
                .toArray()
                .map((element) => $(element))
                .forEach(asyncUpdateElement);
              break;
          }
        })
    }
  }

  /**
   * загрузка контента по урл и открытие его в попапе.
   * биндинг JS происходит по событию fancybox
   * @param url
   */
  function asyncLoadPopup(url) {
    isExternalUrl(url) ?
      $.fancybox.open({
        src: url,
        type: 'iframe',
        opts: {
          touch: false,
          closeExisting: true,
          autoFocus: false,
        }
      }) :
      $.get(url, function (html) {
        $.fancybox.open({
          src: html,
          type: 'html',
          opts: {
            touch: false,
            closeExisting: true,
            autoFocus: false,
          }
        });
      })
  }

  function isExternalUrl(url) {
    var host = window.location.hostname;

    var linkHost = function (url) {
      if (/^https?:\/\//.test(url)) { // Absolute URL.
        // The easy way to parse an URL, is to create <a> element.
        // @see: https://gist.github.com/jlong/2428561
        var parser = document.createElement('a');
        parser.href = url;

        return parser.hostname;
      } else { // Relative URL.
        return window.location.hostname;
      }
    }(url);

    return host !== linkHost;
  }

  function openExternalLink(link) {
    var a = document.createElement('a');
    a.href = link;
    a.target = '_blank';
    a.click()
  }

  /**
   * обновление куска страницы с сервера
   * @param $element jQuery - jquery элемент который требуется заменить
   */
  function asyncUpdateElement($element) {
    $.ajax({
      url: $element.attr('data-update-url'),
      type: 'GET',
      success: function (response) {
        var $response = $(response);
        $element.replaceWith($response);
        $response.trigger(EVENT_BINDING_REQUIRED);
      }
    })
  }

  function asyncGetAction(url) {
    $.get({
      url: url,
      success: function (response) {
        onSuccess(null, response)
      },
      error: function (jqXHR, textStatus, errorThrown) {
        onError(null, jqXHR, textStatus, errorThrown)
      }
    });
  }

  /**
   * функция для обнуления формы
   * @param formEl HTMLElement
   */
  function resetForm(formEl) {
    const form = formEl
    const selects = $(form).find('select');
    const datepickers = $(form).find('.js-datepicker');
    const mcselect = $(form).find('.js-mc-select');
    const filesEl = $(form).find('.input-uploader');
    const files = $(form).find('.input-uploader [data-filename]');
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
      $(filesEl).removeClass('is-full');
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
        success: function (data) {
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

  /**
   * отправка формы в поддержку
   * @deprecated fixprice не использует этот код, т.к. используется более общий метод onAjaxFormSubmit
   */
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
        success: function (data) {
          window.globalFunctions.openPopup($('#popup-feedback-success')[0]);
          resetForm(self);
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

/* eslint-enable */
