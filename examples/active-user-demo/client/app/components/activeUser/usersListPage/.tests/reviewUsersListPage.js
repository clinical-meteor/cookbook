exports.command = function(user, rowIndex, isNew) {
  this
    .verify.elementPresent("#usersListPage")
    .verify.elementPresent("#usersListPage #userNavHeader")
    .verify.elementPresent("#userSearchInput")
    .verify.elementPresent("#usersUnorderedList")
    .verify.elementPresent("#usersUnorderedList li:nth-child(1)")
    .verify.elementPresent("#usersUnorderedList li:nth-child(1) article")
    .verify.elementPresent("#usersListPage #userNavFooter")

  if(isNew){
    this
      .verify.elementPresent("#usersUnorderedList #noResultsMessage")
      .verify.elementPresent("#usersUnorderedList .addUserItem")
      .verify.elementNotPresent("#usersUnorderedList li:nth-child(2)")
      .verify.elementNotPresent("#usersUnorderedList li:nth-child(2) article")
  }

  if(user){
    if(!rowIndex){
      rowIndex = 1;
    }
    if(user.profile && user.profile.fullName){
      this
        .clearValue('#userSearchInput')
        .setValue('#userSearchInput', user.profile.fullName).pause(300)
    }

    this
      .verify.elementPresent("#usersUnorderedList li:nth-child(" + rowIndex + ")")
      .verify.elementPresent("#usersUnorderedList li:nth-child(" + rowIndex + ") article")
      .verify.elementPresent("#usersUnorderedList li:nth-child(" + rowIndex + ") .barcode")
      .verify.elementPresent("#usersUnorderedList li:nth-child(" + rowIndex + ") .fullNameText")
      .verify.elementPresent("#usersUnorderedList li:nth-child(" + rowIndex + ") .descriptionText")
      .verify.containsText("#usersUnorderedList li:nth-child(" + rowIndex + ") .fullNameText", user.profile.fullName)

      if(user.profile){
        if(user.profile.description){
          this.verify.containsText("#usersUnorderedList li:nth-child(1) .descriptionText", user.profile.description)
        }
        if(user._id){
          this.verify.containsText("#usersUnorderedList li:nth-child(1) .barcode", user._id)
        }

      }
  }

  return this;
};
