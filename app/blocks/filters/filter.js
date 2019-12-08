/* eslint-disable max-len */
const $ = window.$;

export default function filter() {
  // преобразуте дату вида дд.мм.гггг
  function getDateInMS(date) {
    const target = date.split('.');
    const isoDate = new Date(target[2], (target[1] - 1), target[0]);
    return isoDate.getTime();
  }

  function filtration() {
    // значения фильтров
    const filterLocation = $('[data-filter-location]').val();
    const filterStartDate = $('[data-filter-start-date]').val().split('/').join('.');
    const filterEndDate = $('[data-filter-end-date]').val().split('/').join('.');
    let isFilteredByLocation = false; // будем ли фильтровать по месту
    let isFilteredByDate = false; // будем ли фильтровать по дате
    let filteredByLocation; // элементы отфильтрованные по месту
    let filteredByDate; // элементы отфильтрованные по дате
    let filteredResult = null; // элементы отфильтрованные в итоге

    console.log(`Шаг даты из формы ${filterStartDate}, ${filterEndDate}`);

    if (filterLocation) {
      isFilteredByLocation = true;
      filteredByLocation = $(`[data-filter-location-value="${filterLocation}"]`);
    }

    if (filterStartDate && filterEndDate) {
      isFilteredByDate = true;
      const msFilterStartDate = getDateInMS(filterStartDate);
      const msFilterEndDate = getDateInMS(filterEndDate);

      console.log(`Шаг преобразованные в мс даты ${msFilterStartDate}, ${msFilterEndDate}`);

      filteredByDate = $('[data-filter-date]').filter((i, el) => {
        const caseDate = new Date($(el).attr('data-filter-date')).getTime();

        console.log(`Шаг преобразованные в мс дата мк ${caseDate}`);

        return (caseDate >= msFilterStartDate && caseDate <= msFilterEndDate);
      });

      console.log(`Шаг итоговая выборка по дате ${filteredByDate}`);
    }

    if (isFilteredByDate && isFilteredByLocation) {
      if (filteredByDate.length > 0 && filteredByLocation.length > 0) {
        const timeResults = $(filteredByDate).map((i, el) => $(filteredByLocation).filter((k, val) => $(el).is(val))).get();

        console.log(`Шаг совместная с локацией выборка ${timeResults}`);

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

  $(document).on('change', '[data-filter-location], [data-filter-end-date]', filtration);
}
/* eslint-enable max-len */
