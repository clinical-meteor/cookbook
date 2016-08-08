exports.command = function() {
  this
    .verify.elementPresent("#fooUpsertPage")
    .verify.elementPresent("#fooUpsertCard")
    .verify.elementPresent("#fooMetaData")
    .verify.elementPresent("#fooMetaInputs")
    .verify.elementPresent("#fooTitleInput")
    .verify.elementPresent("#fooUrlInput")
    .verify.elementPresent("#fooImageUrlInput")
    .verify.elementPresent("#fooImage")
    .verify.elementPresent("#fooDescriptionInput")
  return this;
};
