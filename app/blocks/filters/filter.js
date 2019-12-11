/* eslint-disable max-len */
const $ = window.$;

export default function filter() {
  // преобразуте дату вида дд.мм.гггг
  function getDateInMS(date, reverse) {
    const target = date.split('.');
    let isoDate;
    if (reverse) {
      isoDate = new Date(target[0], (target[1] - 1), target[2]);
    } else {
      isoDate = new Date(target[2], (target[1] - 1), target[0]);
    }
    return isoDate.getTime();
  }

  function filtration() {
    // значения фильтров
    const filterLocation = $('[data-filter-location]').val();
    const filterStartDate = $('[data-filter-start-date]').val() || '01.01.2000';
    const filterEndDate = $('[data-filter-end-date]').val() || '01.01.3000';
    let isFilteredByLocation = false; // будем ли фильтровать по месту
    let isFilteredByDate = false; // будем ли фильтровать по дате
    let filteredByLocation; // элементы отфильтрованные по месту
    let filteredByDate; // элементы отфильтрованные по дате
    let filteredResult = null; // элементы отфильтрованные в итоге

    if (filterLocation) {
      isFilteredByLocation = true;
      filteredByLocation = $(`[data-filter-location-value="${filterLocation}"]`);
    }

    if (filterStartDate && filterEndDate) {
      isFilteredByDate = true;
      const msFilterStartDate = getDateInMS(filterStartDate);
      const msFilterEndDate = getDateInMS(filterEndDate);

      filteredByDate = $('[data-filter-date]').filter((i, el) => {
        const caseDate = getDateInMS($(el).attr('data-filter-date'), true);

        return (caseDate >= msFilterStartDate && caseDate <= msFilterEndDate);
      });
    }

    if (isFilteredByDate && isFilteredByLocation) {
      if (filteredByDate.length > 0 && filteredByLocation.length > 0) {
        const timeResults = $(filteredByDate).map((i, el) => $(filteredByLocation).filter((k, val) => $(el).is(val))).get();

        filteredResult = timeResults.reduce((res, el) => $(res).add(el));
      } else {
        filteredResult = null;
      }
    } else if (isFilteredByDate) {
      if (filteredByDate.length > 0) {
        filteredResult = filteredByDate;
      } else {
        filteredResult = null;
      }
    } else if (filteredByLocation.length > 0) {
      filteredResult = filteredByLocation;
    } else {
      filteredResult = null;
    }

    if (filteredResult === null) {
      window.globalFunctions.openPopup(document.getElementById('popup-no-mc'));
    } else {
      const allCases = $('.master-classes__slide'); // все элементы
      const unfilteredCases = $(allCases).not(filteredResult); // не прошедшие фильтрацию
      $(allCases).removeClass('is-filtration-fall');
      setTimeout(() => {
        $(unfilteredCases).addClass('is-filtration-fall'); // метим не прошедшие фильтрацию
        // cбрасываем статусы с кнопок
        $('.js-show-mc-all').removeClass('is-engage');
        $('.js-show-mc-next3').removeClass('is-engage');
        // обновляем вид
        window.globalFunctions.showCards();
      });
    }
  }

  $(document).on('change', '[data-filter-location], [data-filter-start-date], [data-filter-end-date]', filtration);

  $(document).on('click', '.js-reset-filter', (evt) => {
    evt.preventDefault();
    const self = evt.currentTarget;
    const form = self.form;
    const selects = $(form).find('select');
    $(selects).each((i, el) => el.choices.setChoiceByValue(''));
    form.reset();
    $('.master-classes__slide').removeClass('is-filtration-fall');
    setTimeout(window.globalFunctions.showCards);
  });
}
/* eslint-enable max-len */
