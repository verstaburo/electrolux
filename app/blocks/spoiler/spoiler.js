const $ = window.$;

export default function spoiler() {
  $(document).on('click', '.js-show-more', (evt) => {
    evt.preventDefault();
    const self = evt.currentTarget;
    const target = $(self).attr('data-spoiler');
    const content = $(`[data-spoiler-content="${target}"]`);
    if ($(self).is('.is-active')) {
      $(content).slideUp(300, () => {
        $(self).removeClass('is-active');
      });
    } else {
      $(self).addClass('is-active');
      $(content).slideDown(300);
    }
  });
}
