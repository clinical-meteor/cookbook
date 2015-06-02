


exports.command = function() {
  this
    .verify.elementPresent("#plantsTablePage")
    .verify.elementPresent("#plantSearchInput")
    .verify.elementPresent("#plantsTable")
  return this;
};
