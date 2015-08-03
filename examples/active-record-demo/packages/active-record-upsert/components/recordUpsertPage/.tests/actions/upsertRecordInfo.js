exports.command = function (action, record, title, url, imageUrl, description) {

  if (action === "update") {
    this
      .verify.elementPresent("#recordUpsertPage .barcode")
      .click("#recordUpsertPage .barcode").pause(300)
  }


  // then we check whether we received an entire record to parse
  // if so, set the fields we're goint to test for accordingly
  if (record) {
    if (record.title) {
      title = record.title;
    }
    if (record.url) {
      url = record.url;
    }
    if (record.imageUrl) {
      imageUrl = record.imageUrl;
    }
    if (record.description) {
      description = record.description;
    }
  }

  if (title) {
    this
      .clearValue('input[name="title"]')
      .setValue('input[name="title"]', title);
  }
  if (url) {
    this
      .clearValue('input[name="url"]')
      .setValue('input[name="url"]', url);
  }
  if (imageUrl) {
    this
      .clearValue('input[name="imageUrl"]')
      .setValue('input[name="imageUrl"]', imageUrl);
  }
  if (description) {
    this
      .clearValue('input[name="description"]')
      .setValue('input[name="description"]', description);
  }


  this
    .verify.elementPresent("#saveRecordButton")
    .moveToElement('#saveRecordButton', 10, 10)
    .verify.visible('#saveRecordButton')

  .click("#saveRecordButton").pause(300);

  return this;
};
