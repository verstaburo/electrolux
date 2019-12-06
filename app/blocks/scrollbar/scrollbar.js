/* eslint-disable */
import OverlayScrollbars from 'overlayscrollbars';

export default function scrollbar() {
  function scrollbarInit(el) {
    OverlayScrollbars(el, {
      className: 'os-theme-electrolux',
      scrollbars: {
        clickScrolling: true,
        paddingAbsolute: true,
      },
    });
  }

  window.globalFunctions.scrollbarInit = scrollbarInit;

  $('.js-scrollbar').each((i, el) => {
    scrollbarInit(el);
  });
}
/* eslint-enable */
