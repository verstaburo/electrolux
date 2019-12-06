const $ = window.$;

export default function orderForm() {
  $(document).on('click', '.js-show-orderform', (evt) => {
    evt.preventDefault();
    const self = evt.currentTarget;
    $(self).addClass('is-hidden');
    $('.order-form').slideDown(300);
  });

  $(document).on('click', '.js-hide-orderform', (evt) => {
    evt.preventDefault();
    $('.order-form').slideUp(300, () => {
      $('.js-show-orderform').removeClass('is-hidden');
    });
  });
}
