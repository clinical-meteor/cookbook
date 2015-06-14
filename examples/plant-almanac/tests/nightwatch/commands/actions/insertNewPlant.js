


exports.command = function(plant) {
  this
    .setValue("#plantCommonNameInput", plant.commonName)
    .setValue("#plantLatinNameInput", plant.latinName)
    .setValue("#plantUrlInput", plant.url)
    .setValue("#plantImageUrlInput", plant.imageUrl)
    .setValue("#plantDescriptionInput", plant.description)

    .moveToElement("#mainPanel", 10, 10).pause(500)
    .verify.elementPresent("#savePlantButton")
    .click("#savePlantButton").pause(500)

  return this;
};
