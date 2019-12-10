const $ = window.$;

export default function feedbackForm() {
  const feedback = {
    open() {
      if ($(window).width() >= window.globalOptions.sizes.md) {
        $('body, html').stop().animate({
          scrollTop: 0,
        }, 300, 'swing', () => {
          $('.header .js-close-feedback').addClass('is-active');
          $('.feedback-form').addClass('is-active');
          window.globalFunctions.navigationClose();
        });
      } else {
        $('.header .js-close-feedback').addClass('is-active');
        $('.feedback-form').addClass('is-active');
        window.globalFunctions.navigationClose();
      }
    },
    close() {
      $('.header .js-close-feedback').removeClass('is-active');
      $('.feedback-form').removeClass('is-active');
    },
    isActive() {
      return $('.feedback-form').is('.is-active');
    },
  };

  $(document).on('click', '.js-show-feedback', (evt) => {
    evt.preventDefault();

    if (!feedback.isActive()) {
      feedback.open();
    }
  });

  $(document).on('click', '.js-close-feedback', (evt) => {
    evt.preventDefault();
    feedback.close();
  });
}
