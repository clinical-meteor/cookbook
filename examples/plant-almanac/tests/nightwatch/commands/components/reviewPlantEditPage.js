


exports.command = function() {
  this
    .verify.elementPresent("#plantEditPage")
    .verify.elementPresent("#plantEditCard")
    .verify.elementPresent("#plantTitleInput")
    .verify.elementPresent("#plantUrlInput")
    .verify.elementPresent("#plantDescriptionInput")
    .verify.elementPresent("#editPlantButton")
  return this;
};
