Router.route("/new/record", {
  name:"recordNewPage",
  template:"recordNewPage"
});




//-------------------------------------------------------------

Template.recordNewPage.events({
  'click #newRecordButton': function() {
    console.log('creating new Records...');

      // TODO:  add validation functions

      var customerObject = {
        title: $('#recordTitleInput').val(),
        description: $('#recordDescriptionInput').val(),
        url: $('#recordUrlInput').val()
      };

      Records.insert(customerObject, function(error, resultId){
        if(resultId){
          Router.go('/record/' + resultId)
        }
        if(error){
          console.log("[click #newRecordButton] error: ", error);
        }
      });

  }
});
