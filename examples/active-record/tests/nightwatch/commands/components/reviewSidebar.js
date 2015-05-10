

exports.command = function(username, password) {
  this
    .verify.elementPresent("#sidebarMenu")
    .verify.elementPresent("#sidebarMenuContents")
    // .verify.elementPresent("#currentUserEmail")
    // .verify.elementPresent("#marketingButton")
    // .verify.elementPresent("#eulaButton")
    // .verify.elementPresent("#privacyButton")
    // .verify.elementPresent("#logoutButton")
    // .verify.elementPresent("#connectionStatusPanel")

  return this; // allows the command to be chained.
};
