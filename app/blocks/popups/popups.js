// http://fancyapps.com/fancybox/3/
import '@fancyapps/fancybox';

import {
  freeze,
  unfreeze,
} from '../js-functions/freeze';

const $ = window.$;

export default function popups() {
  const fancyOptions = {
    afterLoad: freeze,
    afterClose: unfreeze,
  };

  function openPopup(src) {
    $.fancybox.open({
      src,
      type: 'inline',
      opts: fancyOptions,
    });
  }

  function closePopup() {
    $.fancybox.close();
  }

  window.globalFunctions.openPopup = openPopup;
  window.globalFunctions.closePopup = closePopup;

  $('.js-fancybox').fancybox({
    afterLoad: freeze,
    afterClose: unfreeze,
  });
}
