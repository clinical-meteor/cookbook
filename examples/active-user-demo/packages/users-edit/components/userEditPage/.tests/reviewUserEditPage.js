exports.command = function() {
  this
    .verify.elementPresent("#userEditPage")
    .verify.elementPresent("#userEditCard")
    .verify.elementPresent("#usernameInput")
    .verify.elementPresent("#userEmailInput")
    .verify.elementPresent("#userFullNameInput")
    .verify.elementPresent("#editUserButton")
  return this;
};
