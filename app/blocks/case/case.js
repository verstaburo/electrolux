const $ = window.$;

export default function cases() {
  $(document).on('click', '.js-show-describe', (evt) => {
    evt.preventDefault();

    const self = evt.currentTarget;
    const card = $(self).closest('.case');

    if ($(card).hasClass('is-hover')) {
      $(card).removeClass('is-hover');
    } else {
      $(card).addClass('is-hover');
    }
  });

  $(window).on('resize', () => {
    if ($(window).width() >= window.globalOptions.sizes.sm) {
      $('.case').removeClass('is-hover');
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
