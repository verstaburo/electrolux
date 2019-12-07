const $ = window.$;

export default function inputUploader() {
  $(document).on('change', '.input-uploader input', (evt) => {
    const self = evt.currentTarget;
    const file = self.files[0];
    const nameContainer = $(self).siblings('[data-filename]');
    if (file) {
      const name = file.name;
      $(nameContainer).text(name);
    } else {
      $(nameContainer).text('');
    }
  });
}
