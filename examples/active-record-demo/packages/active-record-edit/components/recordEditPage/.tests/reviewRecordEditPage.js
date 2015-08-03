exports.command = function() {
  this
    .verify.elementPresent("#recordEditPage")
    .verify.elementPresent("#fooEditCard")
    .verify.elementPresent('input[name="title"]')
    .verify.elementPresent('input[name="url"]')
    .verify.elementPresent('input[name="description"]')
    .verify.elementPresent("#editFooButton")
  return this;
};
