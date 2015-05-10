exports.command = function() {
  this
    .verify.elementPresent("#fooEditPage")
    .verify.elementPresent("#fooEditCard")
    .verify.elementPresent("#fooTitleInput")
    .verify.elementPresent("#fooUrlInput")
    .verify.elementPresent("#fooDescriptionInput")
    .verify.elementPresent("#editFooButton")
  return this;
};
