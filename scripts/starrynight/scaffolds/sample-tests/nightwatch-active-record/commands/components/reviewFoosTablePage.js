exports.command = function() {
  this
    .verify.elementPresent("#foosTablePage")
    .verify.elementPresent("#fooSearchInput")
    .verify.elementPresent("#foosTable")
  return this;
};
