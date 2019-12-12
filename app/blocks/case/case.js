import ResizeObserver from 'resize-observer-polyfill';

const $ = window.$;

export default function cases() {
  // выравниваем header у кейсов
  const CaseStyle = {
    // делим массив на отрезки заданной длины
    slice(arr, n) {
      const blocklen = n;
      const newArr = $.makeArray(arr);

      return newArr.reduce((p, c, i) => {
        if (i % blocklen === 0) p.push([]);
        p[p.length - 1].push(c);
        return p;
      }, []);
    },
    // получаем максимум в массиве
    getMaxOfArray(numArray) {
      return Math.max.apply(null, numArray);
    },
    // выравниваем заголовки в переданной группе
    alignTitles(arr) {
      const titles = [];
      const height = [];
      $(arr).each((i, el) => {
        const title = $(el).find('.case__header');
        height.push($(title).outerHeight());
        titles.push(title);
      });
      const res = CaseStyle.getMaxOfArray(height);
      $(titles).each((i, el) => {
        $(el).css({
          height: (`${res}px`),
        });
      });
    },
  };

  function aligns() {
    const cards = $('.case');

    // выравнивание в каталоге
    if (cards.length) {
      // обнуляем высоту
      $(cards).find('.case__header').css({
        height: '',
      });
      CaseStyle.alignTitles($.makeArray(cards));
    }
  }

  function setObserversForCaseAlign() {
    const targets = document.querySelectorAll('.master-classes__content, .case');
    const tarLen = targets.length;

    if (tarLen) {
      for (let i = 0; i < tarLen; i += 1) {
        const sectionsSizesWatch = new ResizeObserver(() => {
          aligns();
        });

        sectionsSizesWatch.observe(targets[i]);
      }
    }
  }

  aligns();
  setObserversForCaseAlign();

  $(document).on('click', '.js-show-describe', (evt) => {
    evt.preventDefault();

    const self = evt.currentTarget;
    const card = $(self).closest('.case');
    const menu = $(card).find('[data-menu-block]');

    $(menu).slideDown();
    $(card).addClass('is-opened');
  });

  $(document).on('click', '.js-hide-describe', (evt) => {
    evt.preventDefault();

    const self = evt.currentTarget;
    const card = $(self).closest('.case');
    const menu = $(card).find('[data-menu-block]');

    $(menu).slideUp();
    $(card).removeClass('is-opened');
  });

  $(window).on('resize', () => {
    aligns();

    if ($(window).width() >= window.globalOptions.sizes.sm) {
      $('.case').removeClass('is-opened');
      $('[data-menu-block]').removeAttr('style');
    }
  });

  $(document).on('click', '.js-order-mc', (evt) => {
    evt.preventDefault();

    const self = evt.currentTarget;
    const link = $(self).attr('href').split('#').pop();
    const target = $(`#${link}`);
    const location = $(self).attr('data-location-value');
    const caseId = $(self).attr('data-case-index');
    const locationField = $('#order [data-location]')[0];
    const caseRadio = $(`[data-target-case-index="${caseId}"]`);
    const formShowBtn = $('.js-show-orderform');

    $(formShowBtn)[0].click();

    if (locationField) {
      locationField.choices.setChoiceByValue(location);
    }

    if (caseRadio) {
      caseRadio.click();
    }

    if (target.length > 0) {
      $('body, html').stop().animate({
        scrollTop: target.offset().top - 60,
      }, 600, 'swing');
    }
  });
}
