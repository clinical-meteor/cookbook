exports.command = function() {
  this
    .verify.elementPresent("#fooPreviewPage")
    .verify.elementPresent("#fooPreviewCard")
    .verify.elementPresent("#fooTitleText")
    .verify.elementPresent("#notesText")
  return this;
};
