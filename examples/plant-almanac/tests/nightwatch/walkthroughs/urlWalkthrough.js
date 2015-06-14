// add tests to this file using the Nightwatch.js API
// http://nightwatchjs.org/api

module.exports = {
  "URL Walkthrough" : function (client) {
    client
      .url("http://localhost:3000")
      .resizeWindow(1024, 768)

      .verify.elementPresent("body")
      .verify.elementPresent("#mainPanel")
      .verify.elementPresent("#transparentPanel")

      .url("http://localhost:3000/edit/plant/foo")
      .sectionBreak("http://localhost:3000/edit/plant/foo")
      .reviewPlantEditPage()

      .url("http://localhost:3000/export/plants")
      .sectionBreak("http://localhost:3000/export/plants")
      .reviewPlantExportPage()

      .url("http://localhost:3000/new/plant")
      .sectionBreak("http://localhost:3000/new/plant")
      .reviewPlantNewPage()

      .url("http://localhost:3000/plant/foo")
      .sectionBreak("http://localhost:3000/plant/foo")
      .reviewPlantPreviewPage()

      .url("http://localhost:3000/grid/plants")
      .sectionBreak("http://localhost:3000/grid/plants")
      .reviewPlantsImageGridPage()

      .url("http://localhost:3000/list/plants")
      .sectionBreak("http://localhost:3000/list/plants")
      .reviewPlantsListPage()

      .url("http://localhost:3000/table/plants")
      .sectionBreak("http://localhost:3000/table/plants")
      .reviewPlantsTablePage()

      .url("http://localhost:3000/insert/plant")
      .sectionBreak("http://localhost:3000/insert/plant")
      .reviewPlantUpsertPage()

      .url("http://localhost:3000/upsert/plant/foo")
      .sectionBreak("http://localhost:3000/upsert/plant/foo")
      .reviewPlantUpsertPage()

      .url("http://localhost:3000/view/plant/foo")
      .sectionBreak("http://localhost:3000/view/plant/foo")
      .reviewPlantUpsertPage()

      .end();
  }
};
