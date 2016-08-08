exports.command = function() {
  this
    .verify.elementPresent("#foosListPage")
    .verify.elementPresent("#fooSearchInput")
    .verify.elementPresent("#foosUnorderedList")
  return this;
};
