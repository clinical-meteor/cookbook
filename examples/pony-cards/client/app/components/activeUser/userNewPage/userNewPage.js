Router.route("/new/user", {
  name:"userNewPage",
  template:"userNewPage"
});




//-------------------------------------------------------------

Template.userNewPage.events({
  'click #newUserButton': function() {
    console.log('creating new Users...');

      // TODO:  add validation functions

      var customerObject = {
        title: $('#userTitleInput').val(),
        description: $('#userDescriptionInput').val(),
        url: $('#userUrlInput').val()
      };

      Users.insert(customerObject, function(error, resultId){
        if(resultId){
          Router.go('/user/' + resultId)
        }
        if(error){
          console.log("[click #newUserButton] error: ", error);
        }
      });

  }
});
