Router.route("/about", {
  name:"about",
  template:"about"
});

Template.about.helpers({ 
  rendered: function(){

  }
});

Template.about.events({ 
  "click #elementId": function(event, template){

  }
});
