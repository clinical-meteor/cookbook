exports.command = function() {
  this
    .verify.elementPresent("#userPreviewPage")
    .verify.elementPresent("#userPreviewCard")
    .verify.elementPresent("#userfullNameText")
    .verify.elementPresent("#notesText")
  return this;
};
