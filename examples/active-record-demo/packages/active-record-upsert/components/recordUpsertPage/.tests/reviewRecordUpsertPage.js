exports.command = function(record, title, url, imageUrl, description) {

  // first we test that default elements are there
  this
    .verify.elementPresent("#recordUpsertPage")
    .verify.elementPresent("#recordUpsertPage .pageHeader")
    .verify.elementPresent("#recordUpsertCard")
    .verify.elementPresent("#recordMetaData")
    .verify.elementPresent("#recordMetaInputs")
    .verify.elementPresent('input[name="title"]')
    .verify.elementPresent('input[name="url"]')
    .verify.elementPresent('input[name="imageUrl"]')
    .verify.elementPresent("#recordImage")
    .verify.elementPresent('input[name="description"]')


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

      // if the field was specified, lets check it's set in its corresponding input
      if(title){
        this.verify.attributeEquals('input[name="title"]', "value", title)
      }
      if(url){
        this.verify.attributeEquals('input[name="url"]', "value", url)
      }
      if(imageUrl){
        this.verify.attributeEquals('input[name="imageUrl"]', "value", imageUrl)
      }
      if(description){
        this.verify.attributeEquals('input[name="description"]', "value", description)
      }

  this
    .verify.elementPresent("#recordUpsertPage .pageFooter")
    .verify.elementPresent("#saveRecordButton")
  return this;
};
