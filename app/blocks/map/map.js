/* eslint-disable no-unused-vars */
const $ = window.$;

export default function maps() {
  $(document).on('click', '.js-show-map', (evt) => {
    evt.preventDefault();
    const self = evt.currentTarget;
    const mapId = $(self).attr('href').split('#').pop();
    const map = $(`#${mapId}`);
    const top = $(map).offset().top + $(map).height();
    let timer;

    function reTime(el) {
      if (timer) {
        clearTimeout(timer);
      }
      timer = setTimeout(() => {
        $(el).removeClass('is-active');
        $(self).removeClass('is-active');
      }, 30000);
    }

    if ($(self).is('.is-active')) {
      clearTimeout(timer);
      $(self).removeClass('is-active');
      $(map).removeClass('is-active');
    } else {
      $(self).addClass('is-active');
      $(map).addClass('is-active');

      reTime(map);
      $(map).on('click', e => reTime($(e.currentTarget)));
      $(map).on('keydown', e => reTime($(e.currentTarget)));
      $(map).on('touchstart', e => reTime($(e.currentTarget)));
      $(map).on('mousedown', e => reTime($(e.currentTarget)));
      $(map).on('mousewheel', e => reTime($(e.currentTarget)));

      if ($(window).width() < window.globalOptions.sizes.sm) {
        $('body, html').stop().animate({
          scrollTop: top,
        }, 300, 'swing');
      }
    }
  });
}
/* eslint-enable no-unused-vars */
