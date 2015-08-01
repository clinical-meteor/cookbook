exports.command = function() {
  this
    .verify.elementPresent("#recordImageGridPage")
    .verify.elementPresent("#recordSearchInput")
    .verify.elementPresent("#recordImageGrid")
    .verify.elementPresent("#addNewRecord")
  return this;
};
