exports.command = function ( action, user, callback ) {

  if ( action === "update" ){
    this
      .verify.elementPresent("#userUpsertPage .barcode")
      .click("#userUpsertPage .barcode").pause(500);
  }

  if ( user ){

    if ( user.username ){
      this
        .clearValue("#usernameInput")
        .setValue("#usernameInput", user.username)
        .verify.elementPresent("#usernameInput");
    }
    if ( user.emails && user.emails && user.emails[ 0 ].address ){
      this
        .clearValue("#userEmailInput")
        .setValue("#userEmailInput", user.emails[ 0 ].address )
        .verify.elementPresent("#userEmailInput");
    }

    if ( user.profile ){

      if ( user.profile.avatar ){
        this
          .clearValue("#userAvatarInput")
          .setValue("#userAvatarInput", user.profile.avatar )
          .verify.elementPresent("#userAvatarInput");
      }
      if ( user.profile.fullName ){
        this
          .clearValue("#userFullNameInput")
          .setValue("#userFullNameInput", user.profile.fullName)
          .verify.elementPresent("#userFullNameInput");
      }
      if ( user.profile.description ){
        this
          .clearValue("#userDescriptionInput")
          .setValue("#userDescriptionInput", user.profile.description)
          .verify.elementPresent("#userDescriptionInput");
      }
    }
  }

  this
    .verify.elementPresent("#saveUserButton")
    .moveToElement("#saveUserButton", 10, 10)
    .verify.visible("#saveUserButton")
    .click("#saveUserButton").pause(500);

  return this;
};
