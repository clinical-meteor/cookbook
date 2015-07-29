exports.command = function() {
  this
    .verify.elementPresent("#userNewPage")
    .verify.elementPresent("#usernameInput")
    .verify.elementPresent("#userFullNameInput")
    .verify.elementPresent("#userEmailInput")
    .verify.elementPresent("#newUserButton")
  return this;
};
