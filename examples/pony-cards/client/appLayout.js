Session.set("resize", null);
Session.setDefault('appHeight', $(window).height());
Session.setDefault('appWidth', $(window).width());

Meteor.startup(function () {
  window.addEventListener('resize', function(){
    Session.set("resize", new Date());
    Session.set("appHeight", $(window).height());
    Session.set("appWidth", $(window).width());
  });
});




Session.setDefault('transparencyDivHeight', 100);
Session.setDefault('transparencyDivLeft', 0);

//==================================================================================================
// FAMO.US

cardCol = [
      {img: 'http://lorempixel.com/150/150/sports', label: 'Card A'},
      {img: 'http://lorempixel.com/150/150/abstract', label: 'Card B'},
      {img: 'http://lorempixel.com/150/150/cats', label: 'Card C'},
      {img: 'http://lorempixel.com/150/150/food', label: 'Card D'},
      {img: 'http://lorempixel.com/150/150/food', label: 'Card E'},
      {img: 'http://lorempixel.com/150/150/cats', label: 'Card F'},
      {img: 'http://lorempixel.com/150/150/abstract', label: 'Card G'},
      {img: 'http://lorempixel.com/150/150/sports', label: 'Card H'}
    ];
    

cardDim = [150,150];  // card dimensions in pixel
gridCols = 2;         // number of grid columns
gridGutter = 5;       // spacing between cardPos

Template.body.helpers({
  cards: function(){
    return cardCol;
  },
  layoutSize: [
    gridGutter*2 + (cardDim[0]+gridGutter)*gridCols,
    undefined,
  ],
  layoutOptions: {
    itemSize: cardDim,
    spacing: [ gridGutter, gridGutter ],
    margins: [ gridGutter, gridGutter, gridGutter, gridGutter ]
  }
});

function flipSurface(event, fview) {
  fview.parent.view.flip({
    curve : 'easeOutBounce',
    duration : 500
  });
}

Template.flipper_front.famousEvents({ 'click': flipSurface });
Template.flipper_back.famousEvents({ 'click': flipSurface });


//==================================================================================================

Template.appLayout.rendered = function(){
  Template.appLayout.layout();
}

Template.appLayout.helpers({
  resized: function () {
    Template.appLayout.layout();
  },
  getStyle: function () {
    return parseStyle({
      "left": Session.get('transparencyDivLeft') + "px;",
      "height": Session.get('transparencyDivHeight') + "px;"
    });
  }
});


Template.appLayout.layout = function(){
  Session.set('transparencyDivHeight', $('#innerPanel').height() + 80);
  console.log('appWidth', Session.get('appWidth'));
  if(Session.get('appWidth') > 768){
    Session.set('transparencyDivLeft', (Session.get('appWidth') - 768) * 0.5);
  }else{
    Session.set('transparencyDivLeft', 0);
  }
}
Template.appLayout.delayedLayout = function(timeout){
  Meteor.setTimeout(function(){
    Template.appLayout.layout();
  }, timeout);
}


//==================================================================================================




parseStyle = function(json){
  var result = "";
  $.each(json, function(i, val){
    result = result + i + ":" + val + " ";
  });
  return result;
}
