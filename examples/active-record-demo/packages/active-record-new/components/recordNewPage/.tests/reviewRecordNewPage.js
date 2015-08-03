exports.command = function() {
  this
    .verify.elementPresent("#recordNewPage")
    .verify.elementPresent('input[name="title"]')
    .verify.elementPresent('input[name="description"]')
    .verify.elementPresent('input[name="url"]')
    .verify.elementPresent("#newRecordButton")
  return this;
};
