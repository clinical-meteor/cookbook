Router.route("/new/foo", {
  name: "recordNewPage",
  template: "recordNewPage"
});

//-------------------------------------------------------------

Template.recordNewPage.events({
  'click #newRecordButton': function () {
    console.log('creating new foo...');

    // TODO:  add validation functions

    var customerObject = {
      title: $('input[name="title"]').val(),
      description: $('input[name="description"]').val(),
      url: $('input[name="url"]').val()
    };

    Foo.insert(customerObject, function (error, resultId) {
      if (resultId) {
        Router.go('/foo/' + resultId);
      }
      if (error) {
        console.log("[click #newRecordButton] error: ", error);
      }
    });

  }
});
