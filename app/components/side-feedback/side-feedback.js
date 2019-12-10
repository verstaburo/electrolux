const $ = window.$;

export default function sideFeedback() {
  $(document).on('click', '.js-show-panel', (evt) => {
    evt.preventDefault();
    const self = evt.currentTarget;
    const panel = $(self).closest('[data-panel]');

    $(panel).toggleClass('is-active');
  });

  $(window).on('resize', () => {
    if ($(window).width() >= window.globalOptions.sizes.sm) {
      const panel = $('[data-panel]');
      $(panel).removeClass('is-active');
    }
  });

  $(document).on('click', '.js-show-phones', (evt) => {
    const self = evt.currentTarget;
    if ($(window).width() >= window.globalOptions.sizes.sm) {
      evt.preventDefault();
      const popup = $(self).attr('data-popup');
      const popupEl = $(popup);
      window.globalFunctions.openPopup(popupEl);
    }
  });
}
