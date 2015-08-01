exports.command = function(title, barcode, description, isNew) {
  this
    .verify.elementPresent("#recordsListPage")
    .verify.elementPresent("#recordsListPage #fooNavHeader")
    .verify.elementPresent("#recordSearchInput")
    .verify.elementPresent("#foosUnorderedList")
    .verify.elementPresent("#foosUnorderedList li:nth-child(1)")
    .verify.elementPresent("#foosUnorderedList li:nth-child(1) article")
    .verify.elementPresent("#recordsListPage .recordFooter")

  if(isNew){
    this
      .verify.elementPresent("#foosUnorderedList #noResultsMessage")
      .verify.elementPresent("#foosUnorderedList .addFooItem")
      .verify.elementNotPresent("#foosUnorderedList li:nth-child(2)")
      .verify.elementNotPresent("#foosUnorderedList li:nth-child(2) article")
  }

  if(title){
    this
      .clearValue('#recordSearchInput')
      .setValue('#recordSearchInput', title).pause(300)
      .verify.elementPresent("#foosUnorderedList li:nth-child(1)")
      .verify.elementPresent("#foosUnorderedList li:nth-child(1) article")
      .verify.elementPresent("#foosUnorderedList li:nth-child(1) .barcode")
      .verify.elementPresent("#foosUnorderedList li:nth-child(1) .titleText")
      .verify.elementPresent("#foosUnorderedList li:nth-child(1) .descriptionText")
      .verify.containsText("#foosUnorderedList li:nth-child(1) .titleText", title)

      if(description){
        this.verify.containsText("#foosUnorderedList li:nth-child(1) .descriptionText", description)
      }
      if(barcode){
        this.verify.containsText("#foosUnorderedList li:nth-child(1) .barcode", barcode)
      }
  }

  return this;
};
