exports.command = function(action, user, title, url, imageUrl, description) {

  if(action === "update"){
    this
      .verify.elementPresent("#fooUpsertPage .barcode")
      .click("#fooUpsertPage .barcode").pause(300)
  }


  // then we check whether we received an entire user to parse
  // if so, set the fields we're goint to test for accordingly
  if(user){
    if(user.title){
      title = user.title;
    }
    if(user.url){
      url = user.url;
    }
    if(user.imageUrl){
      imageUrl = user.imageUrl;
    }
    if(user.description){
      description = user.description;
    }
  }

  if(title){
    this
      .clearValue('#fooTitleInput')
      .setValue('#fooTitleInput', title)
  }
  if(url){
    this
      .clearValue('#fooUrlInput')
      .setValue('#fooUrlInput', url)
  }
  if(imageUrl){
    this
      .clearValue('#fooImageUrlInput')
      .setValue('#fooImageUrlInput', imageUrl)
  }
  if(description){
    this
      .clearValue('#fooDescriptionInput')
      .setValue('#fooDescriptionInput', description)
  }


  this
    .verify.elementPresent("#saveFooButton")
    .moveToElement('#saveFooButton', 10, 10)
    .verify.visible('#saveFooButton')

    .click("#saveFooButton").pause(300)

  return this;
};
