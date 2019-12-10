import isTouchDevice from 'is-touch-device';

const $ = window.$;

export default class McSelect {
  constructor(el) {
    this.el = $(el);
    this.label = this.el.find('[data-label]');
    this.head = this.el.find('[data-head]');
    this.inputs = this.el.find('[data-mc-input]');
    this.preset = this.preset.bind(this);
    this.getSelectedElem = this.getSelectedElem.bind(this);
  }
  init() {
    const t = this;

    $(t.head).on('click', (evt) => {
      evt.preventDefault();
      if (!isTouchDevice()) {
        if (t.isOpen()) {
          t.close();
        } else {
          t.open();
        }
      }
    });

    $(t.head).on('touchstart', (evt) => {
      evt.preventDefault();
      if (isTouchDevice()) {
        if (t.isOpen()) {
          t.close();
        } else {
          t.open();
        }
      }
    });

    $(t.inputs).on('click', () => {
      t.preset();
      t.close();
    });

    $(t.inputs).on('change', () => {
      t.preset();
      t.close();
    });

    $(document).on('click', (evt) => {
      const self = evt.target;
      if (!($(self).is(t.el) || $(self).closest(t.el).length > 0)) {
        t.close();
      }
    });

    $(window).on('resize', () => {
      t.preset();
      t.close();
    });

    t.el[0].mcselect = t;
  }
  getSelectedElem() {
    const t = this;
    const activeEl = t.el.find('[data-mc-input]:checked');
    const parent = activeEl.closest('[data-select-item]');
    const elem = parent.find('[data-select-value]');
    return elem;
  }
  preset() {
    const t = this;
    const currEl = t.getSelectedElem();
    t.label.empty();
    if (currEl.length) {
      const cloneEl = $(currEl).clone();
      t.label.append(cloneEl);
    }
  }
  open() {
    this.el.addClass('is-open');
  }
  close() {
    this.el.removeClass('is-open');
  }
  isOpen() {
    return this.el.is('.is-open');
  }
}
