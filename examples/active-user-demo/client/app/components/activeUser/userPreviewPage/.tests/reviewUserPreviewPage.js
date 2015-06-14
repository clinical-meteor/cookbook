exports.command = function() {
  this
    .verify.elementPresent("#userPreviewPage")
    .verify.elementPresent("#userPreviewCard")
    .verify.elementPresent("#userTitleText")
    .verify.elementPresent("#notesText")
  return this;
};
