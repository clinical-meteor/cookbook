exports.command = function(user, title, url, imageUrl, description) {

  // first we test that default elements are there
  this
    .verify.elementPresent("#fooUpsertPage")
    .verify.elementPresent("#fooUpsertPage .pageHeader")
    .verify.elementPresent("#fooUpsertCard")
    .verify.elementPresent("#fooMetaData")
    .verify.elementPresent("#fooMetaInputs")
    .verify.elementPresent("#fooTitleInput")
    .verify.elementPresent("#fooUrlInput")
    .verify.elementPresent("#fooImageUrlInput")
    .verify.elementPresent("#fooImage")
    .verify.elementPresent("#fooDescriptionInput")


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

      // if the field was specified, lets check it's set in its corresponding input
      if(title){
        this.verify.attributeEquals("#fooTitleInput", "value", title)
      }
      if(url){
        this.verify.attributeEquals("#fooUrlInput", "value", url)
      }
      if(imageUrl){
        this.verify.attributeEquals("#fooImageUrlInput", "value", imageUrl)
      }
      if(description){
        this.verify.attributeEquals("#fooDescriptionInput", "value", description)
      }

  this
    .verify.elementPresent("#fooUpsertPage .pageFooter")
    .verify.elementPresent("#saveFooButton")
  return this;
};
