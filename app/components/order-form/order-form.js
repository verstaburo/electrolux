const $ = window.$;

export default function orderForm() {
  const array22 = [];
  const array12 = [];
  const array2 = [];
  for (let i = 1; i <= 22; i += 1) {
    const result = {
      value: i,
      label: i,
    };
    array22.push(result);
    if (i < 3) {
      array2.push(result);
    }
    if (i < 13) {
      array12.push(result);
    }
  }
  // получаем строку активных элементов
  function getFormFilterTypes() {
    const filtersEl = $('[data-form-type]:checked');
    let filterString = '';
    $(filtersEl).each((i, el) => {
      filterString += `${$(el).attr('data-form-type')},`;
    });
    return filterString.slice(0, -1);
  }

  window.globalFunctions.getFormTypes = getFormFilterTypes;

  // высчитываем цену
  function setPrice() {
    const currentMc = $('[data-form-mc]:checked');
    const basePrice = (currentMc.length > 0) ? $(currentMc).attr('data-case-price') : 0;
    const filter = getFormFilterTypes().split(',');
    let multiplayer;
    if (filter.includes('child')) {
      if (filter.includes('oven')) {
        multiplayer = $('[data-child]').length - 1;
      } else {
        multiplayer = $('[data-child]').length;
      }
    } else {
      multiplayer = Number($('[data-form-vacancy]').val()) || 1;
    }
    const totalPrice = basePrice * multiplayer;
    $('[data-total-price]').text(totalPrice);
  }

  window.globalFunctions.setTotalPrice = setPrice;

  // определяем допустимое количество свободных мест
  function setVacancies() {
    const filter = getFormFilterTypes().split(',');
    const location = Number($('[data-location]').val());
    const vacancy = $('[data-form-vacancy]')[0].choices;
    if (filter.includes('child')) {
      switch (location) {
        case 1:
          $('.js-add-child').attr('data-max-childs-count', 11);
          break;
        default:
          $('.js-add-child').attr('data-max-childs-count', 8);
          break;
      }
    } else if (filter.includes('oven')) {
      vacancy.setChoices(array2, 'value', 'label', true);
    } else {
      switch (location) {
        case 2:
          vacancy.setChoices(array12, 'value', 'label', true);
          break;
        default:
          vacancy.setChoices(array22, 'value', 'label', true);
          break;
      }
    }
  }

  window.globalFunctions.setFormVacancies = setVacancies;

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

  function switchElements(string) {
    stateElements.disabled('[data-form-field]');
    const array = string.split(',');

    // устанавливаем видимость полей в зависимости от духового шкафа и детей
    if (array.includes('oven')) {
      if ($('[data-child]').length > 1) {
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

  // показываем форму
  $(document).on('click', '.js-show-orderform', (evt) => {
    evt.preventDefault();
    const self = evt.currentTarget;
    $(self).addClass('is-hidden');
    window.globalFunctions.setTotalPrice();
    $('.order-form').slideDown(300);
  });

  // скрываем форму
  $(document).on('click', '.js-hide-orderform', (evt) => {
    evt.preventDefault();
    $('.order-form').slideUp(300, () => {
      $('.js-show-orderform').removeClass('is-hidden');
    });
  });

  $(document).on('change', '[data-oven], [data-form-mc]', () => {
    switchElements(getFormFilterTypes());
    setTimeout(window.globalFunctions.setTotalPrice());
    setTimeout(window.globalFunctions.setFormVacancies, 10);
  });

  $(document).on('change', '[data-location]', window.globalFunctions.setFormVacancies);
  $(document).on('change', '[data-form-vacancy]', window.globalFunctions.setTotalPrice);
}
