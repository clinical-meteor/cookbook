exports.command = function() {
  this
    .verify.elementPresent("#fooImageGridPage")
    .verify.elementPresent("#fooSearchInput")
    .verify.elementPresent("#fooImageGrid")
    .verify.elementPresent("#addNewFoo")
  return this;
};
