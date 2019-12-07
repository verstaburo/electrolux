/* eslint-disable no-unused-vars */
import ResizeObserver from 'resize-observer-polyfill';
// https://idangero.us/swiper/api/
import * as Swiper from '../../../node_modules/swiper/js/swiper';

const $ = window.$;

export default function masterClasses() {
  function setSliderForMC() {
    const bp = window.globalOptions.sizes;
    const wW = $(window).width();

    $('.js-mc-slider').each((i, el) => {
      const isSwiper = el.swiper;
      if (wW < bp.sm) {
        if (!isSwiper) {
          const nextEl = $(el).closest('.master-classes').find('.master-classes__toggle_next');
          const prevEl = $(el).closest('.master-classes').find('.master-classes__toggle_prev');
          const porgressEl = $(el).closest('.master-classes').find('.master-classes__progress');
          const sw = new Swiper(el, {
            speed: 300,
            slidesPerView: 1,
            spaceBetween: 0,
            centeredSlides: false,
            roundLengths: true,
            freeMode: false,
            slideClass: 'master-classes__slide',
            wrapperClass: 'master-classes__wrapper',
            navigation: {
              nextEl,
              prevEl,
            },
            on: {
              init() {
                const self = this;
                const currentSlide = self.activeIndex + 1;
                const totalSlides = $(self.slides).not('.is-filtration-fall').length;
                $(porgressEl).text(`${currentSlide}/${totalSlides}`);
              },
              slideChange() {
                const self = this;
                const currentSlide = self.activeIndex + 1;
                const totalSlides = $(self.slides).not('.is-filtration-fall').length;
                $(porgressEl).text(`${currentSlide}/${totalSlides}`);
              },
              progress() {
                const self = this;
                const currentSlide = self.activeIndex + 1;
                const totalSlides = $(self.slides).not('.is-filtration-fall').length;
                $(porgressEl).text(`${currentSlide}/${totalSlides}`);
              },
            },
          });
        }
      } else if (isSwiper) {
        isSwiper.destroy(true, true);
      }
    });
  }

  function setObserversForMC() {
    const targets = document.querySelectorAll('.master-classes');
    const tarLen = targets.length;

    if (tarLen) {
      for (let i = 0; i < tarLen; i += 1) {
        const sectionsSizesWatch = new ResizeObserver(() => {
          setSliderForMC();
        });

        sectionsSizesWatch.observe(targets[i]);
      }
    }
  }

  setSliderForMC();
  setObserversForMC();

  window.mcInit = () => {
    setSliderForMC();
    setObserversForMC();
  };

  function showCards() {
    const slides = $('.master-classes__slide:not(.is-filtration-fall)');
    const bp = window.globalOptions.sizes;
    const wW = $(window).width();
    const isShowNext3 = $('.js-show-mc-next3').is('.is-engage');
    const isShowAll = $('.js-show-mc-all').is('.is-engage');
    if (isShowAll) {
      $(slides).removeClass('is-hide');
    } else if (isShowNext3) {
      if (wW >= bp.sm && wW < bp.md) {
        $(slides).each((i, el) => {
          if (i > 3) {
            $(el).addClass('is-hide');
            $('.js-show-mc-all').removeClass('is-hidden');
          } else {
            $(el).removeClass('is-hide');
            $('.js-show-mc-all').addClass('is-hidden');
          }
        });
      } else if (wW >= bp.md) {
        $(slides).each((i, el) => {
          if (i > 5) {
            $(el).addClass('is-hide');
            $('.js-show-mc-all').removeClass('is-hidden');
          } else {
            $(el).removeClass('is-hide');
            $('.js-show-mc-all').addClass('is-hidden');
          }
        });
      } else {
        $(slides).each((i, el) => {
          $(el).removeClass('is-hide');
        });
        $('.js-mc-slider').each((i, el) => {
          el.swiper.update();
        });
      }
    } else if (wW >= bp.sm && wW < bp.md) {
      $(slides).each((i, el) => {
        if (i > 1) {
          $(el).addClass('is-hide');
          $('.js-show-mc-next3').removeClass('is-hidden');
        } else {
          $(el).removeClass('is-hide');
          $('.js-show-mc-next3').addClass('is-hidden');
        }
      });
    } else if (wW >= bp.md) {
      $(slides).each((i, el) => {
        if (i > 2) {
          $(el).addClass('is-hide');
          $('.js-show-mc-next3').removeClass('is-hidden');
        } else {
          $(el).removeClass('is-hide');
          $('.js-show-mc-next3').addClass('is-hidden');
        }
      });
    } else {
      $(slides).removeClass('is-hide');
      $('.js-mc-slider').each((i, el) => {
        el.swiper.update();
        el.swiper.slideTo(0);
        // el.swiper.destroy(true, true);
      });
      // setSliderForMC();
    }
  }

  window.globalFunctions.showCards = showCards;

  showCards();

  $(window).on('resize', showCards);

  $(document).on('click', '.js-show-mc-next3', (evt) => {
    evt.preventDefault();
    const self = evt.currentTarget;
    $(self).addClass('is-engage');
    setTimeout(showCards);
  });

  $(document).on('click', '.js-show-mc-all', (evt) => {
    evt.preventDefault();
    const self = evt.currentTarget;
    $(self).addClass('is-engage');
    setTimeout(showCards);
  });
}
/* eslint-enable no-unused-vars */
