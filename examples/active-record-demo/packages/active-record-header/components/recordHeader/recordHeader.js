Template.recordHeader.helpers({
  isRecord: function () {
    if (this.type === "record") {
      return true;
    } else {
      return false;
    }
  },
  getHeaderOpacity: function (){
    return "background: linear-gradient(225deg, transparent 28.28px, rgba(255,255,255," + Session.get("glassOpacity") + ") 0) top right;";
  }
});

Template.recordHeader.events({
  "click .listButton": function (event, template) {
    Router.go('/list/foos');
  },
  "click .imageGridButton": function (event, template) {
    Router.go('/grid/foos');
  },
  "click .tableButton": function (event, template) {
    Router.go('/table/foos');
  }
});
