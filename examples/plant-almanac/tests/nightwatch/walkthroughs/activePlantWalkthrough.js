// add tests to this file using the Nightwatch.js API
// http://nightwatchjs.org/api



var plant = {
  commonName: "Tiger Lily",
  latinName: "Lilium superbum",
  url: "http://en.wikipedia.org/wiki/Lilium_superbum",
  imageUrl: "http://upload.wikimedia.org/wikipedia/commons/7/74/LiliumSuperbum1.jpg",
  description: "Lilium superbum is a species of true lily native to the eastern and central regions of North America.[2][3][4] Common names include Turk's cap lily,[2] turban lily, swamp lily,[5] lily royal,[5] or American tiger lily.[3] The native range of the species extends from New Hampshire south to the Florida Panhandle and west to Missouri and Arkansas."
}


module.exports = {
  "Active Plant Walkthrough" : function (client) {


    client
      .resizeWindow(1024, 768)

        .url("http://localhost:3000/insert/plant")

        .sectionBreak("Insert Plant Page")
        .reviewPlantUpsertPage()
        .insertNewPlant(plant)
        .reviewPlantUpsertPage(plant)

        .moveToElement("#mainPanel", 10, 10).pause(500)
        .click(".imageGridButton").pause(500)

        .sectionBreak("Image Grid of Plants")
        .reviewPlantsImageGridPage()
        .moveToElement("#mainPanel", 10, 10).pause(500)
        .click(".listButton").pause(500)

        .sectionBreak("List of Plants")
        .reviewPlantsListPage()
        .moveToElement("#mainPanel", 10, 10).pause(500)
        .click(".tableButton").pause(500)

        .sectionBreak("Table of Plants")
        .reviewPlantsTablePage()
        .moveToElement("#mainPanel", 10, 10).pause(500)
        .click(".imageGridButton").pause(500)


        .sectionBreak("Back to the List of Plants")
        .reviewPlantsImageGridPage()
        /*
        .click(".tableButton").pause(500)

        .reviewPlantUpsertPage()
        .click("#savePlantButton").pause(500)

        .reviewPlantUpsertPage()

        .reviewPlantPreviewPage()

        .reviewPlantEditPage()

        .reviewPlantExportPage()

        */

      .end();
  }
};
