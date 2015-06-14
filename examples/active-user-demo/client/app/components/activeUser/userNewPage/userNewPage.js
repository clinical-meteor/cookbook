Router.route("/new/user", {
  name:"userNewPage",
  template:"userNewPage"
});




//-------------------------------------------------------------

Template.userNewPage.events({
  'click #newRecordButton': function() {
    console.log('creating new Meteor.users...');

      // TODO:  add validation functions

      var customerObject = {
        title: $('#usernameInput').val(),
        description: $('#userFullNameInput').val(),
        url: $('#userEmailInput').val()
      };

      Meteor.users.insert(customerObject, function(error, resultId){
        if(resultId){
          Router.go('/user/' + resultId)
        }
        if(error){
          console.log("[click #newRecordButton] error: ", error);
        }
      });

  }
});
