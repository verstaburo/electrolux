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
}
