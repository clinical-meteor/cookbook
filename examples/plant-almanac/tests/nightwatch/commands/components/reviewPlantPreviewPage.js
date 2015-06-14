


exports.command = function() {
  this
    .verify.elementPresent("#plantPreviewPage")
    .verify.elementPresent("#plantPreviewCard")
    .verify.elementPresent("#plantTitleText")
    .verify.elementPresent("#notesText")
  return this;
};
