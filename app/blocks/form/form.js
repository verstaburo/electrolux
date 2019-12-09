/* eslint-disable */
// https://github.com/jshjohnson/Choices
import Choices from 'choices.js';

// https://github.com/leongersen/noUiSlider
import noUiSlider from 'nouislider';

// https://github.com/t1m0n/air-datepicker
import 'air-datepicker';

// https://github.com/RobinHerbots/Inputmask
import Inputmask from 'inputmask';

const $ = window.$;

export function selects() {
  function initSelect(select) {
    const self = select;
    const choices = new Choices(select, {
      searchEnabled: false,
      itemSelectText: '',
      shouldSort: false,
      callbackOnCreateTemplates(template) {
        const classNames = this.config.classNames;
        return {
          containerInner: () => template(`
            <div class="${classNames.containerInner}"><div class="choices__toggle"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 8.46 16"><path d="M8.46,8l-7-8L0,1.24,5.91,8,0,14.76,1.47,16Z"/></svg></div></div>
          `),
        };
      },
      callbackOnInit() {
        const choiceList = this.choiceList.element;
        const dropdown = this.dropdown.element;
        const scrollWrapper = document.createElement('div');
        scrollWrapper.classList.add('choices__scrollblock');
        $(choiceList).wrap(scrollWrapper);
        const newScrollWrapper = $(dropdown).find('.choices__scrollblock');
        window.globalFunctions.scrollbarInit(newScrollWrapper);
      },
    });
    const defaultValue = self.value;
    self.choices = choices;
    self.defaultSelectedValue = defaultValue;
  }

  window.globalFunctions.initSelect = initSelect;

  $('.js-select').each((i, el) => {
    initSelect(el);
  });
}

export function sliders() {
  // Параметры берутся из дата-атрибутов
  $('.js-range').each(function () {
    const el = $(this);

    noUiSlider.create(el.get(0), {
      start: el.data('start'),
      connect: el.data('connect'),
      range: {
        min: el.data('min'),
        max: el.data('max'),
      },
    });
  });
}

export function datepicker() {

  $.fn.datepicker.language['ru'] = {
    days: ['Воскресенье', 'Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница', 'Суббота'],
    daysShort: ['Вос', 'Пон', 'Вто', 'Сре', 'Чет', 'Пят', 'Суб'],
    daysMin: ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'],
    months: ['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь', 'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'],
    monthsShort: ['Янв', 'Фев', 'Мар', 'Апр', 'Май', 'Июн', 'Июл', 'Авг', 'Сен', 'Окт', 'Ноя', 'Дек'],
    today: 'Сегодня',
    clear: 'Очистить',
    dateFormat: 'dd.mm.yyyy',
    timeFormat: 'hh:ii',
    firstDay: 1
  };

  $('.js-datepicker-range').datepicker({
    classes: 'inputbox__datepicker',
    format: 'dd/mm/yyyy',
    range: true,
    toggleSelected: false,
    onSelect(fd, d, inst) {
      const datesString = fd;
      const dates = datesString.split(',');
      const el = inst.$el;
      const startDateField = $(el).find('[data-start-date]');
      const endDateField = $(el).find('[data-end-date]');
      if (dates.length === 2) {
        $(startDateField).val(dates[0].split('.').join('/')).change();
        $(endDateField).val(dates[1].split('.').join('/')).change();
        setTimeout(() => {
          $(el).removeClass('is-show-date');
        }, 50);
      }
    },
  });

  $(document).on('click', '.js-show-datepicker', (evt) => {
    evt.preventDefault();
    const self = evt.currentTarget;
    const datepicker = $(self).closest('.js-datepicker-range, .js-datepicker');
    $(datepicker).addClass('is-show-date');
  });

  $(document).on('mouseleave', '.js-datepicker-range, .js-datepicker', (evt) => {
    const self = evt.currentTarget;
    $(self).removeClass('is-show-date');
  });

  $('.js-datepicker').each((i, el) => {
    $(el).datepicker({
      classes: 'inputbox__datepicker',
      format: 'dd.mm.yyyy',
      altField: '[data-date]',
      altFieldDateFormat: 'dd.mm.yyyy',
      onSelect() {
        setTimeout(() => {
          $(el).removeClass('is-show-date');
        }, 50);
      },
    });
  });
}

export function inputmask() {
  Inputmask.extendDefinitions({
    'f': { //masksymbol
      "validator": "[0-3]"
    },
    'g': { //masksymbol
      "validator": "[0-1]"
    }
  });
  Inputmask({
    mask: '+7 (999) 999-99-99',
  }).mask('input[data-type="tel"]');

  Inputmask({
    alias: 'email',
  }).mask('input[data-type="email"]');

  Inputmask({
    mask: 'f9/g9/2099',
  }).mask('input[data-type="date"]');

  Inputmask({
    mask: 'f9.g9.2099',
  }).mask('input[data-type="date2"]');
}

export function numberinput() {
  $(document).on('click', '.js-numberbox-minus, .js-numberbox-plus', function (e) {
    e.preventDefault();

    const input = $(this).parent().find('.js-numberbox-input');
    let val = +input.val();
    const minus = $(this).attr('class').includes('minus') || false;

    if (!val.length) {
      input.val(1);
    }

    if (minus) {
      input.val(val > 0 ? (val -= 1) : 0);
    } else {
      input.val(val += 1);
    }
  });

  $(document).on('keyup change', '.js-numberbox-input', function () {
    this.value = this.value.replace(/[^\d]/, '');
    if ($(this).val() < 0) $(this).val(0);
  });
}
/* eslint-enable */
