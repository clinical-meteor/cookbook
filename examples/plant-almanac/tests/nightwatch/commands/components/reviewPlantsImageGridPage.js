

exports.command = function() {
  this
    .verify.elementPresent("#plantImageGridPage")
      .verify.elementPresent("#plantSearchInput")
      .verify.elementPresent("#plantImageGrid")
      .verify.elementPresent("#addNewPlant")

  return this;
};
