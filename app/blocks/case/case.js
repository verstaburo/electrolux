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

  // $(document).on('mouseenter', '.case', (evt) => {
  //   evt.preventDefault();

  //   const self = evt.currentTarget;

  //   $(self).addClass('is-hover');
  // });

  // $(document).on('mouseleave', '.case', (evt) => {
  //   evt.preventDefault();

  //   const self = evt.currentTarget;

  //   $(self).removeClass('is-hover');
  // });

  $(window).on('resize', () => {
    if ($(window).width() >= window.globalOptions.sizes.sm) {
      $('.case').removeClass('is-hover');
    }
  });
}
