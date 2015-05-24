Router.route("/new/plant", {
  name:"plantNewPage",
  template:"plantNewPage"
});




//-------------------------------------------------------------

Template.plantNewPage.events({
  'click #newPlantButton': function() {
    console.log('creating new Plants...');

      // TODO:  add validation functions

      var customerObject = {
        commonName: $('#plantTitleInput').val(),
        description: $('#plantDescriptionInput').val(),
        url: $('#plantUrlInput').val()
      };

      Plants.insert(customerObject, function(error, resultId){
        if(resultId){
          Router.go('/plant/' + resultId)
        }
        if(error){
          console.log("[click #newPlantButton] error: ", error);
        }
      });

  }
});
