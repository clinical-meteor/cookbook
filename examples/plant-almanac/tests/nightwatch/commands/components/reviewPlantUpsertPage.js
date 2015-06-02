



exports.command = function(plant) {
  this
    .verify.elementPresent("#plantUpsertPage")
    .verify.elementPresent("#plantImageGridButton")
    .verify.elementPresent("#plantListButton")
    .verify.elementPresent("#plantTableButton")
    .verify.elementPresent("#plantUpsertCard")
    .verify.elementPresent("#plantMetaData")
    .verify.elementPresent("#plantMetaInputs")
    .verify.elementPresent("#plantCommonNameInput")
    .verify.elementPresent("#plantLatinNameInput")
    .verify.elementPresent("#plantUrlInput")
    .verify.elementPresent("#plantImageUrlInput")
    .verify.elementPresent("#plantImage")
    .verify.elementPresent("#plantDescriptionInput")
    .verify.elementPresent("#savePlantButton")
    //.verify.elementPresent("#removePlantButton")

    if(plant){
      this
        .verify.attributeEquals("#plantCommonNameInput", "value", plant.commonName)
        .verify.attributeEquals("#plantLatinNameInput", "value", plant.latinName)
        .verify.attributeEquals("#plantUrlInput", "value", plant.url)
        .verify.attributeEquals("#plantImageUrlInput", "value", plant.imageUrl)
        .verify.attributeEquals("#plantDescriptionInput", "value", plant.description)
    }

  return this;
};
