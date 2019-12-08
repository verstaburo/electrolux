const $ = window.$;

export default function addChild() {
  function loadTemplate(url) {
    if (window.templates === undefined) {
      $.ajax(url, {
        dataType: 'json',
        async: false,
        type: 'GET',
        complete(answer) {
          window.templates = answer.responseJSON;
        },
      });
    }
  }

  $(document).on('click', '.js-add-child', (evt) => {
    const self = evt.currentTarget;
    const form = $(self).closest('form');
    const childTemplateURL = $(self).attr('data-child-template-src');
    loadTemplate(childTemplateURL);
    const whaitTemplate = setInterval(() => {
      if (window.templates !== undefined) {
        clearInterval(whaitTemplate);
        const childTemplate = window.templates.orderFormChild;
        const childesContainer = $(form).find('[data-child-container]');
        const childFields = $(self).attr('data-child-fields-names').split(',');
        const fieldsCount = $(childFields).length;
        const maxChildes = Number($(self).attr('data-max-childs-count'));
        const curChildes = $('[data-child]').length;
        const freePlaces = maxChildes - curChildes;
        if (freePlaces > 0) {
          const newChild = $(childTemplate);
          const selects = $(newChild).find('.js-select');
          $(selects).each((i, el) => {
            window.globalFunctions.initSelect(el);
          });
          $(childesContainer).append(newChild);
          if (freePlaces === 1) {
            $(self).fadeOut(300);
          }
          const childes = $('[data-child]');
          for (let i = 0; i < fieldsCount; i += 1) {
            $(childes).find(`[name*="${childFields[i]}"]`).each((k, el) => {
              $(el).attr('name', `${childFields[i]}[${k}]`);
            });
          }
        }
        setTimeout(window.globalFunctions.switcherFormElements);
      }
    }, 20);
  });

  $(document).on('click', '.js-remove-child', (evt) => {
    const self = evt.currentTarget;
    const child = $(self).closest('[data-child]');
    $(child).remove();
    setTimeout(window.globalFunctions.switcherFormElements);
  });
}
