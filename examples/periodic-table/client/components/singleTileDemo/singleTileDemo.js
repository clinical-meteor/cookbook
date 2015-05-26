

Template.singleTileDemo.onRendered(function() {

    $(".famous-container").remove();
    div = document.createElement('div');
    div.className += "famous-container";
    document.body.appendChild(div);
    Famous.Engine.init();

    var scene = Famous.Engine.createScene('div');

    var rootNode = scene.addChild();
    var aNode = scene.addChild();

    aNode
        .setSizeMode('absolute', 'absolute', 'absolute')
        .setAbsoluteSize(350, 50)
        .setAlign(0.5,0,0)
        .setMountPoint(0.5, 0)
        .setOrigin(0.5, 0,0)


    rootNode
        // Set size mode to 'absolute' to use absolute pixel values: (width 250px, height 250px)
        .setSizeMode('absolute', 'absolute', 'absolute')
        .setAbsoluteSize(250, 250)
        .setAlign(0.5, 0.5,10)
        .setMountPoint(0.5, 0.5)
        .setOrigin(0.5, 0.5,10)


    var colors = ["Red", "Blue", "Green"];

    colors.forEach(function(color, index){
      var element = new Famous.DOMElement(rootNode, {
          tagName: 'div',
          content: 'Famo.us ' + color + " Mode! " + index,
          properties: {
              'border':'1px solid black',
              'color':'white',
              'text-align':'center',
              'cursor': 'pointer',
              'opacity': '.99999',
              'letter-spacing': '2px',
              'background-repeat': 'no-repeat',
              'background-size': '100% 100%',
              'background': "url(panel-item-ticks-hq.png)",
              'background-color':'rgba(73, 160, 154, 0.160784)',
              'padding': '20px'
          }
      }).setAttribute('src', 'panel-item-ticks-hq.png');

    });



    /*var element2 = new Famous.DOMElement(rootNode, {
        tagName: 'img',
        content: 'Famo.us Mixed Mode Examples!',
        properties: {
            'border':'1px solid black',
            'background-color':'rgba(73, 160, 154, 0.160784)',
            'color':'white',
            'text-align':'center',
            'cursor': 'pointer',
            'opacity': '.99999',
            'letter-spacing': '2px',
            'background-repeat': 'no-repeat',
            'background-size': '50% 50%',
        }
    }).setAttribute('src', 'panel-item-ticks-hq.png');*/


    var spinner = rootNode.addComponent({
        onUpdate: function(time) {
            rootNode.setRotation(0, time / 1000, 0);
            rootNode.requestUpdateOnNextTick(spinner);
        }
    });
    rootNode.requestUpdate(spinner);


});
