exports.command = function() {
  this
    .verify.elementPresent("#recordsTablePage")
    .verify.elementPresent("#recordSearchInput")
    .verify.elementPresent("#foosTable")
  return this;
};
