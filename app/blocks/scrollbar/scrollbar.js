/* eslint-disable */
import OverlayScrollbars from 'overlayscrollbars';

export default function scrollbar() {
  OverlayScrollbars(document.querySelectorAll('.js-scrollbar'), {
    className: 'os-theme-electrolux',
    scrollbars: {
      clickScrolling: true,
      paddingAbsolute: true,
      overflowBehavior: {
        x: 'hidden',
      }
    },
  });
}
/* eslint-enable */
