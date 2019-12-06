import McSelect from './McSelect';

const $ = window.$;

export default function mcSelect() {
  $('.js-mc-select').each((i, el) => {
    const select = new McSelect(el);
    select.init();
  });
}
