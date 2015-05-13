exports.command = function(action, record, title, url, imageUrl, description) {

  if(action === "update"){
    this
      .verify.elementPresent("#fooUpsertPage .barcode")
      .click("#fooUpsertPage .barcode").pause(300)
  }


  // then we check whether we received an entire record to parse
  // if so, set the fields we're goint to test for accordingly
  if(record){
    if(record.title){
      title = record.title;
    }
    if(record.url){
      url = record.url;
    }
    if(record.imageUrl){
      imageUrl = record.imageUrl;
    }
    if(record.description){
      description = record.description;
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
