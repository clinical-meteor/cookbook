
Router.route('/singleTile', {
  template: "singleTileDemo",
  name: "singleTileDemo",
  waitOn: function () {
    return Meteor.subscribe('Elements');
  },
});


Template.singleTileDemo.onRendered(function() {
  console.log("Rendering SingleTile");


  Famous.Engine.init();
  var scene = Famous.Engine.createScene('div#famousScene');

  var rootNode = scene.addChild();


  rootNode
      .setSizeMode('absolute', 'absolute', 'absolute')
      .setAbsoluteSize(360, 480)
      .setAlign(0.5, 0.5)
      .setMountPoint(0.5, 0.5)
      .setOrigin(0.5, 0.5);


  /*Elements.find().forEach(function(hydrogen, index){
  //elementArray.forEach(function(hydrogen, index){
    //console.log("hydrogen", hydrogen);


  });*/

    var elementNode = rootNode.addChild();

    var hydrogen = {
      atomicMass: "1.00794(4)",
      atomicNumber: 1,
      atomicRadius: 37,
      name: "Hydrogen",
      symbol: "H"
    };


    //Tracker.autorun(function(){
      elementNode
        .setSizeMode('absolute', 'absolute', 'absolute')
        .setAbsoluteSize(120, 160)
        .setAlign(0.5, 0.5, 10)
        .setMountPoint( 0.5, 0.5)
        .setOrigin(0.5, 0.5, 10)




      new Famous.DOMElement(elementNode, {
          tagName: 'div',
          content: '<span class="atomicNumberText">' + hydrogen.atomicNumber + '</span><br><h1 class="center">' + hydrogen.symbol + '</h1><h5 class="center">' + hydrogen.name + '<br>' + hydrogen.atomicMass + '<br></h5>',
          //content: $('#sampleText').html(),
          properties: {
              'height': '160px',
              'width': '120px',
              'color':'white',
              'cursor': 'pointer',
              'opacity': '.99999',
              'letter-spacing': '2px',
              'display': 'inline-block',
              'background-color':'rgba(73, 160, 154, 0.160784)',
              'background-image': "url(panel-item-ticks-hq.png)",
              'background-repeat': 'no-repeat',
              'background-size': '100% 100%',
              '-webkit-box-shadow': '0 0 12px rgba(231,254,237,0.6)',
              '-webkit-backface-visibility': 'visible',
              'text-align': 'center',
              'font-family': '"HelveticaNeue-Light", "Helvetica Neue Light", "Helvetica Neue", Helvetica, Arial, "Lucida Grande", sans-serif',
              'font-weight': '300'

          }
      })
      .setAttribute('src', 'panel-item-ticks-hq.png');

      var spinner = elementNode.addComponent({
          onUpdate: function(time) {
              elementNode.setRotation(0, time / 1000, 0);
              elementNode.requestUpdateOnNextTick(spinner);
          }
      });
      elementNode.requestUpdate(spinner);

    //});
});


Template.singleTileDemo.onDestroyed(function(){
  console.log("Removing SingleTile");

  $('div#famousScene .famous-dom-renderer').remove();
});
