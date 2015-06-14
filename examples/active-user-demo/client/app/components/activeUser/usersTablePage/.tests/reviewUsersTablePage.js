exports.command = function() {
  this
    .verify.elementPresent("#usersTablePage")
    .verify.elementPresent("#userSearchInput")
    .verify.elementPresent("#usersTable")
  return this;
};
