Router.route("/new/foo", {
  name:"recordNewPage",
  template:"recordNewPage"
});




//-------------------------------------------------------------

Template.recordNewPage.events({
  'click #newFooButton': function() {
    console.log('creating new foo...');

      // TODO:  add validation functions

      var customerObject = {
        title: $('#fooTitleInput').val(),
        description: $('#fooDescriptionInput').val(),
        url: $('#fooUrlInput').val()
      };

      Foo.insert(customerObject, function(error, resultId){
        if(resultId){
          Router.go('/foo/' + resultId)
        }
        if(error){
          console.log("[click #newFooButton] error: ", error);
        }
      });

  }
});
