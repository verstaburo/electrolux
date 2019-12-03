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
    classHandler(el) {
      return $(el.element).closest('.inputbox');
    },
    errorsContainer(el) {
      return $(el.element).closest('.inputbox__wrapper').find('.error-message');
    },
  });
});

// Карты

/* eslint-enable */
