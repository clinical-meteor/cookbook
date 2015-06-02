


exports.command = function() {
  this
    .verify.elementPresent("#plantNewPage")
    .verify.elementPresent("#plantTitleInput")
    .verify.elementPresent("#plantDescriptionInput")
    .verify.elementPresent("#plantUrlInput")
    .verify.elementPresent("#newPlantButton")
  return this;
};
