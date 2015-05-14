$(document).on('change', 'input[type=password]', consolelog);
function consolelog(evt) {
  console.log(evt);
  console.log($(evt.currentTarget).val());
}
