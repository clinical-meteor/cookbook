exports.command = function() {
  this
    .verify.elementPresent("#recordPreviewPage")
    .verify.elementPresent("#fooPreviewCard")
    .verify.elementPresent("#fooTitleText")
    .verify.elementPresent("#notesText")
  return this;
};
