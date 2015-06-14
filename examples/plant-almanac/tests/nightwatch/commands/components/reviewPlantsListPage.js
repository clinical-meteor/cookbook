


exports.command = function() {
  this
    .verify.elementPresent("#plantsListPage")
    .verify.elementPresent("#plantSearchInput")
    .verify.elementPresent("#plantsUnorderedList")
    //.verify.elementPresent("#noResultsMessage")
  return this;
};
