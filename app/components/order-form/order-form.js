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
    let searchString = 'adult';

    if (array.includes('oven')) {
      searchString = 'oven';
    } else if (array.includes('whiterabbit')) {
      searchString = 'whiterabbit';
    } else if (array.includes('child')) {
      searchString = 'child';
    }
    stateElements.enabled($(`[data-form-field*="${searchString}"]`));
  }

  $(document).on('click', '.js-toggle-orderform', (evt) => {
    evt.preventDefault();
    $('[data-orderform]').parsley().whenValidate({
      group: 'start',
    }).done(() => {
      switchElements(getFormFilterTypes());
      $('[data-form-trigger]').hide(300);
      $('[data-form-body]').addClass('is-show');
    });
  });
}
