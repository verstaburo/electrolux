import ResizeObserver from 'resize-observer-polyfill';

const $ = window.$;

export default function navigation() {
  window.pageSections = {};

  function setActiveSection(name) {
    const links = $('[data-nav-link]');
    const activeLink = $(`[data-nav-link=${name}]`);
    const activeTitle = $(activeLink).text();
    const namedBlock = $('[data-active-link-title]');
    $(links).not(activeLink).removeClass('is-active');
    $(activeLink).addClass('is-active');
    $(namedBlock).text(activeTitle);
  }

  function updateSectionParam(el) {
    const name = el.getAttribute('id');
    const top = $(el).offset().top;
    const height = $(el).outerHeight(true);
    const bottom = top + height;
    window.pageSections[name] = {
      top,
      bottom,
    };
  }

  function setSectionsSizes() {
    const targets = document.querySelectorAll('[data-section]');
    const tarLen = targets.length;

    if (tarLen) {
      for (let i = 0; i < tarLen; i += 1) {
        updateSectionParam(targets[i]);
      }
    }
  }

  function findActiveSection(scrollTop) {
    const sections = window.pageSections;
    const names = Object.keys(sections);
    const nmL = names.length;
    let result;
    for (let i = 0; i < nmL; i += 1) {
      const section = sections[names[i]];
      const tS = section.top;
      const bS = section.bottom;
      if (tS <= scrollTop && bS > scrollTop) {
        result = names[i];
      }
    }

    return result;
  }

  function preSetSection() {
    const sT = $(window).scrollTop() + 61;
    const activeSectionName = findActiveSection(sT);
    setActiveSection(activeSectionName);
  }

  function setObserversForSections() {
    const targets = document.querySelectorAll('[data-section]');
    const tarLen = targets.length;

    if (tarLen) {
      for (let i = 0; i < tarLen; i += 1) {
        const sectionsSizesWatch = new ResizeObserver(() => {
          setSectionsSizes();
          preSetSection();
        });

        sectionsSizesWatch.observe(targets[i]);
      }
    }
  }

  setSectionsSizes();
  setObserversForSections();

  window.sectionsInit = () => {
    setSectionsSizes();
    setObserversForSections();
  };

  preSetSection();

  $(window).on('resize', preSetSection);

  $(window).on('scroll', () => {
    const sT = $(window).scrollTop() + 61;
    const activeSectionName = findActiveSection(sT);
    setActiveSection(activeSectionName);
  });

  const nav = {
    open() {
      $('[data-navigation]').addClass('is-opened');
    },
    close() {
      $('[data-navigation]').removeClass('is-opened');
    },
    isOpen() {
      return $('[data-navigation]').is('.is-opened');
    },
  };

  $(document).on('click', '.js-show-nav-list', (evt) => {
    evt.preventDefault();

    if (nav.isOpen()) {
      nav.close();
    } else {
      nav.open();
    }
  });

  $(document).on('click', '[data-nav-link]', (e) => {
    e.preventDefault();

    const self = e.currentTarget;
    const link = $(self).attr('href').split('#').pop();
    const target = $(`#${link}`);

    nav.close();

    if (target.length > 0) {
      $('body, html').stop().animate({
        scrollTop: target.offset().top - 60,
      }, 600, 'swing');
    }
  });

  $(window).on('scroll', () => {
    const sT = $(window).scrollTop();
    const navBlock = $('[data-navigation]');
    const navMobile = $('[data-section]')[0];
    const bp = window.globalOptions.sizes;
    if (navBlock.length > 0) {
      const nBT = $(navBlock).offset().top;
      const nBMT = $(navMobile).offset().top - 61;
      const navTop = ($(window).width() < bp.sm) ? nBMT : nBT;

      if (sT > navTop) {
        $(navBlock).addClass('is-sticky');
      } else {
        $(navBlock).removeClass('is-sticky');
      }
    }
  });
}
