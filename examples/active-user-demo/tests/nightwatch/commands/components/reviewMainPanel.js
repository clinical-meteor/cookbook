exports.command = function (username, password) {
  this
    .verify.elementPresent('body')
    .verify.elementPresent('#mainPanel');

  return this; // allows the command to be chained.
};
