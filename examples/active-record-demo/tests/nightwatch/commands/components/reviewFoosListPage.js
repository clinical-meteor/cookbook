exports.command = function(title, barcode, description, isNew) {
  this
    .verify.elementPresent("#foosListPage")
    .verify.elementPresent("#foosListPage #fooNavHeader")
    .verify.elementPresent("#fooSearchInput")
    .verify.elementPresent("#foosUnorderedList")
    .verify.elementPresent("#foosUnorderedList li:nth-child(1)")
    .verify.elementPresent("#foosUnorderedList li:nth-child(1) article")
    .verify.elementPresent("#foosListPage #fooNavFooter")

  if(isNew){
    this
      .verify.elementPresent("#foosUnorderedList #noResultsMessage")
      .verify.elementPresent("#foosUnorderedList .addFooItem")
      .verify.elementNotPresent("#foosUnorderedList li:nth-child(2)")
      .verify.elementNotPresent("#foosUnorderedList li:nth-child(2) article")
  }

  if(title){
    this
      .clearValue('#fooSearchInput')
      .setValue('#fooSearchInput', title).pause(300)
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
