Template.testingSidebar.helpers({
  getLeft: function () {
    return "left: " + Session.get('sidebarLeft') + "px;";
  },
  isVisible: function () {
    /*if(Session.equals("sidebarVisible", true)){
      return "visible"
    }else{
      return "hidden";
    }*/
  }
});

Template.testingSidebar.events({
  "click li": function (event, template) {
    console.log("event", event.currentTarget.attributes["target"].value);

    $('html, body').animate({
      scrollTop: $("#" + event.currentTarget.attributes["target"].value).offset().top -
        50
    }, 500);
  }
});
