exports.command = function () {
  this
    .verify.elementPresent("#usersImageGridPage")
    .verify.elementPresent("#userSearchInput")
    .verify.elementPresent("#usersImageGrid")
    .verify.elementPresent("#addNewUser");
  return this;
};
