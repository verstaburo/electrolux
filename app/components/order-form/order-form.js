const $ = window.$;

export default function orderForm() {
  // показываем форму
  $(document).on('click', '.js-show-orderform', (evt) => {
    evt.preventDefault();
    const self = evt.currentTarget;
    $(self).addClass('is-hidden');
    $('.order-form').slideDown(300);
  });

  // скрываем форму
  $(document).on('click', '.js-hide-orderform', (evt) => {
    evt.preventDefault();
    $('.order-form').slideUp(300, () => {
      $('.js-show-orderform').removeClass('is-hidden');
    });
  });

  // переключаем секции
  // изменяет состояние элементов в переданной секции
  const stateElements = {
    disabled(section) {
      $(section).addClass('is-disabled');
      const elements = $(section).find('input, select, textarea, button');
      $(elements).each((i, el) => {
        $(el).attr('disabled', 'disabled');
      });
    },
    enabled(section) {
      $(section).removeClass('is-disabled');
      const elements = $(section).find('input, select, textarea, button');
      $(elements).each((i, el) => {
        $(el).removeAttr('disabled', 'disabled');
      });
    },
  };

  function getFormFilterTypes() {
    const filtersEl = $('[data-form-type]:checked');
    let filterString = '';
    $(filtersEl).each((i, el) => {
      filterString += `${$(el).attr('data-form-type')},`;
    });
    return filterString.slice(0, -1);
  }

  function switchElements(string) {
    stateElements.disabled('[data-form-field]');
    const array = string.split(',');

    if (array.includes('oven')) {
      console.log('oven');
      console.log($('[data-child]').length);
      if ($('[data-child]').length > 1) {
        console.log('we are here?');
        stateElements.disabled($('[data-form-field*="free"]'));
        stateElements.enabled($('[data-form-field*="pay"]'));
      } else {
        stateElements.disabled($('[data-form-field*="pay"]'));
        stateElements.enabled($('[data-form-field*="free"]'));
      }
    } else {
      stateElements.disabled($('[data-form-field*="free"]'));
      stateElements.enabled($('[data-form-field*="pay"]'));
    }

    $(array).each((i, el) => {
      stateElements.enabled($(`[data-form-field*="${el}"]`));
    });
  }

  function switcherFormElements() {
    switchElements(getFormFilterTypes());
  }

  window.globalFunctions.switcherFormElements = switcherFormElements;

  $(document).on('change', '[data-oven], [data-form-mc]', () => {
    switchElements(getFormFilterTypes());
  });
}
