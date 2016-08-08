Session.set("resize", null);
Session.setDefault('counter', 0);

Session.setDefault('transparencyDivHeight', 100);
Session.setDefault('transparencyDivLeft', 0);
Session.setDefault('sidebarLeft', 0);
Session.setDefault("sidebarVisible", false);


Session.setDefault('appHeight', $(window).height());
Session.setDefault('appWidth', $(window).width());

Meteor.startup(function () {
  window.addEventListener('resize', function () {
    Session.set("resize", new Date());
    Session.set("appHeight", $(window).height());
    Session.set("appWidth", $(window).width());
  });
});



Session.setDefault('transparencyDivHeight', 100);
Session.setDefault('transparencyDivLeft', 0);



//==================================================================================================

var backgroundImages = [
  "IMG_4641.PNG",
  "IMG_4650.PNG",
  "IMG_4654.PNG",
  "IMG_4656.PNG",
  "IMG_4665.PNG",
  "IMG_4669.PNG",
  "IMG_4671.PNG",
  "IMG_4673.PNG"
];


//==================================================================================================

Template.appLayout.onRendered(function () {
  //Template.hello.layout();
  Template.appLayout.layout();
});

Template.appLayout.helpers({
  getRandomImage: function () {
    return Meteor.absoluteUrl() + Random.choice(backgroundImages);
  },
  resized: function () {
    Template.appLayout.layout();
  },
  getStyle: function () {
    return parseStyle({
      "left": Session.get('transparencyDivLeft') + "px;",
      "height": Session.get('transparencyDivHeight') + "px;"
    });
  },
  getLeft: function () {
    return "left: " + Session.get('transparencyDivLeft') + "px;";
  },
  getHeight: function () {
    return "height: " + Session.get('transparencyDivHeight') + "px;";
  },
  counter: function () {
    return Session.get('counter');
  }
});


Template.appLayout.layout = function () {
  Session.set('transparencyDivHeight', $('#innerPanel').height() + 80);
  //console.log('appWidth', Session.get('appWidth'));
  /*if(Session.get('appWidth') > 1636){
    Session.set('transparencyDivLeft', ((Session.get('appWidth') - 1436) * 0.5) + 100);
    Session.set("sidebarLeft", ((Session.get('appWidth') - 1436) * 0.5) - 100);
  }else */

  if (Session.get('appWidth') > 1168) {
    Session.set('transparencyDivLeft', (Session.get('appWidth') - 768) * 0.5);
    Session.set('sidebarLeft', (Session.get('appWidth') - 1168) * 0.5);
    Session.set("sidebarVisible", true);
  } else if (Session.get('appWidth') > 768) {
    Session.set('transparencyDivLeft', (Session.get('appWidth') - 768) * 0.5);
    Session.set("sidebarLeft", -200);
    Session.set("sidebarVisible", false);
    /*Session.set('sidebarLeft', (Session.get('appWidth') - 768) * 0.5);*/
  } else {
    Session.set('transparencyDivLeft', 0);
    Session.set("sidebarLeft", -200);
    Session.set("sidebarVisible", false);
  }
};
Template.appLayout.delayedLayout = function (timeout) {
  Meteor.setTimeout(function () {
    Template.appLayout.layout();
  }, timeout);
};



//==================================================================================================



parseStyle = function (json) {
  var result = "";
  $.each(json, function (i, val) {
    result = result + i + ":" + val + " ";
  });
  return result;
};
