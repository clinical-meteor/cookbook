


exports.command = function() {
  this
    .verify.elementPresent("#plantExportPage")
    .verify.elementPresent("#plantPreviewCard")
    .verify.elementPresent("#notesText")
  return this;
};
