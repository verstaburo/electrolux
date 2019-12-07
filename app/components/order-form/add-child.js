const $ = window.$;

export default function addChild() {
  $(document).on('click', '.js-add-child', (evt) => {
    const self = evt.currentTarget;
    const form = $(self).closest('form');
    const childTemplate = $(form).find('[data-child-template]');
    const childesContainer = $(form).find('[data-child-container]');
    const childFields = $(self).attr('data-child-fields-names').split(',');
    const fieldsCount = $(childFields).length;
    const maxChildes = Number($(self).attr('data-max-childs-count'));
    const curChildes = $('[data-child]').length;
    const freePlaces = maxChildes - curChildes;
    if (freePlaces > 0) {
      const newChild = $(childTemplate).clone().removeAttr('data-child-template');
      $(childesContainer).append(newChild);
      if (freePlaces === 1) {
        $(self).fadeOut(300);
      }
      const childes = $('[data-child]');
      for (let i = 0; i < fieldsCount; i += 1) {
        $(childes).find(`input[name*="${childFields[i]}"]`).each((k, el) => {
          $(el).attr('name', `${childFields[i]}[${k}]`);
        });
      }
    }
  });
}
