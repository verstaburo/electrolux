const $ = window.$;

export default function totop() {
  $(document).on('click', '.js-to-top', (evt) => {
    evt.preventDefault();

    $('html, body').stop().animate({
      scrollTop: 0,
    }, 300, 'swing');
  });
}
