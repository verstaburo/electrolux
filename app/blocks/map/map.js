/* eslint-disable no-unused-vars */
const $ = window.$;

export default function maps() {
  $(document).on('click', '.js-show-map', (evt) => {
    evt.preventDefault();
    const self = evt.currentTarget;
    const mapId = $(self).attr('href').split('#').pop();
    const map = $(`#${mapId}`);
    const top = $(map).offset().top + $(map).height();
    $(map).addClass('is-active');
    let timer;

    if ($(window).width() < window.globalOptions.sizes.sm) {
      $('body, html').stop().animate({
        scrollTop: top,
      }, 300, 'swing');
    }

    function reTime(el) {
      if (timer) {
        clearTimeout(timer);
      }
      timer = setTimeout(() => {
        $(el).removeClass('is-active');
      }, 30000);
    }
    reTime(map);
    $(map).on('click', e => reTime($(e.currentTarget)));
    $(map).on('keydown', e => reTime($(e.currentTarget)));
    $(map).on('touchstart', e => reTime($(e.currentTarget)));
    $(map).on('mousedown', e => reTime($(e.currentTarget)));
    $(map).on('mousewheel', e => reTime($(e.currentTarget)));
  });
}
/* eslint-enable no-unused-vars */
