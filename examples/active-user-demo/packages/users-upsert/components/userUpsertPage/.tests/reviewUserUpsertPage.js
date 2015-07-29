exports.command = function (user) {

  // first we test that default elements are there
  this
    .verify.elementPresent("#userUpsertPage")
    .verify.elementPresent("#userUpsertPage .pageHeader")
    .verify.elementPresent("#userUpsertCard")
    .verify.elementPresent("#userMetaData")
    .verify.elementPresent("#userMetaInputs")
    .verify.elementPresent("#usernameInput")
    .verify.elementPresent("#userEmailInput")
    .verify.elementPresent("#userAvatarInput")
    .verify.elementPresent("#userImage")
    .verify.elementPresent("#userFullNameInput");


  // then we check whether we received an entire user to parse
  // if so, set the fields we're goint to test for accordingly
  if ( user ) {

    // if the field was specified, lets check it's set in its corresponding input
    if ( user.username ) {
      this.verify.attributeEquals("#usernameInput", "value", user.username);
    }
    if ( user.emails && user.emails && user.emails[ 0 ].address ) {
      this.verify.attributeEquals("#userEmailInput", "value", user.emails[ 0 ].address);
    }

    if ( user.profile ) {
      if ( user.profile.avatar ){
        this.verify.attributeEquals("#userAvatarInput", "value", user.profile.avatar);
      }
      if ( user.profile.fullName ){
        this.verify.attributeEquals("#userFullNameInput", "value", user.profile.fullName);
      }
      if ( user.profile.description ){
        this.verify.attributeEquals("#userDescriptionInput", "value", user.profile.description);
      }
    }
  }


  this
    .verify.elementPresent("#userUpsertPage .pageFooter")
    .verify.elementPresent("#saveUserButton");
  return this;
};
