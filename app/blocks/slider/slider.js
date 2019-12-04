/* eslint-disable */
// https://idangero.us/swiper/api/
import * as Swiper from '../../../node_modules/swiper/js/swiper';

const $ = window.$;

export function slider() {
  $('.js-slider').each((i, el) => {
    const nextEl = $(el).find('.slider__button_next');
    const prevEl = $(el).find('.slider__button_prev');
    const mySlider = new Swiper(el, {
      loop: true,
      speed: 300,
      slidesPerView: 1,
      spaceBetween: 0,
      centeredSlides: false,
      roundLengths: true,
      freeMode: false,
      effect: 'fade',
      slideToClickedSlide: true,
      navigation: {
        nextEl,
        prevEl,
      },
    });
  });
}

/* eslint-enable */
