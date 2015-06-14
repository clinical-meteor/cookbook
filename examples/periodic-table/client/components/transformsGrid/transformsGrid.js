
Router.route('/transforms', {
  template: "transformsGrid",
  name: "transformsGrid",
  waitOn: function () {
    return Meteor.subscribe('Elements');
  }
});


Template.transformsGrid.onRendered(function() {
  console.log("Rendering ListOfSpinners");

  console.log("Famous", Famous);


  Famous.Engine.init();
  var scene = Famous.Engine.createScene('div#famousScene');

  var hydrogen = {
    atomicMass: "1.00794(4)",
    atomicNumber: 1,
    atomicRadius: 37,
    name: "Hydrogen",
    symbol: "H"
  };

  // var rootNode = scene.addChild();


  var camera = new Famous.Camera(scene);
  camera.setDepth(2000);



  var element = hydrogen;
  var self = this;

  // The Demo lays out the dots in form of a grid.
  Demo = function(rows, cols, Elements) {
      var self = this;

      Famous.Node.call(this);

      var count = 0;
      this.dots = [];


      Elements.find({}, {limit: 36}).forEach(function(element, index){
        console.log("element", element);

        var dot = new Dot(index, element);
        self.addChild(dot);
        self.dots.push(dot);
      });

      // Add spinner component. This makes the Demo rotate.
      this.spinner = new Spinner(this);

      // Center demo
      this
          .setMountPoint(0.5, 0.5, 0.5)
          .setAlign(0.5, 0.5, 0.5)
          .setOrigin(0.5, 0, 0)
          .setPosition(0, 0);

      this.layout = new Layout(this);
      Famous.Engine.getClock().setInterval(function() {
          this.layout.next();
      }.bind(this), 2000);
  }
  Demo.prototype = Object.create(Famous.Node.prototype);
  Demo.prototype.constructor = Demo;

  Dot.prototype = Object.create(Famous.Node.prototype);
  Dot.prototype.constructor = Dot;


  scene.addChild(new Demo(6, 6, Elements));

});



Template.singleTileDemo.onDestroyed(function(){
  console.log("Removing ListOfSpinners");
  $('div#famousScene .famous-dom-renderer').remove();
});

COLORS = [ [151, 131, 242], [47, 189, 232] ];
COLOR_STEPS = 18;
DOT_SIZE = 120;





// Dots are nodes.
// They have a DOMElement attached to them by default.
Dot = function(step, element) {
    Famous.Node.call(this);

    // Center dot.
    this
        .setMountPoint(0.5, 0.5, 10)
        .setAlign(0.5, 0.5, 0.5)
        .setSizeMode('absolute', 'absolute', 'absolute')
        .setAbsoluteSize(DOT_SIZE, DOT_SIZE, DOT_SIZE);

    // Add the DOMElement (DOMElements are components).
    this.el = new Famous.DOMElement(this, {
        tagName: 'div',
        content: '<span class="atomicNumberText">' + element.atomicNumber + '</span><br><h1 class="center">' + element.symbol + '</h1><h5 class="center">' + element.name + '<br>' + element.atomicMass + '<br></h5>',
        properties: {
            //background: createColorStep(step),
            //borderRadius: '100%',
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
    });

    // Add the Node.Position component.
    // The position component allows us to transition between different states
    // instead of instantly setting the final translation.
    this.position = new Famous.Position(this);
}



// Components define behavior.
// Spinner is such a component. Attaching the custom Spinner component to a
// Node rotates the node on a frame by frame basis.
Spinner = function(node) {
    this.node = node;
    this.id = this.node.addComponent(this);
    this.node.requestUpdate(this.id);
}

// The onUpdate method will be called on every frame.
Spinner.prototype.onUpdate = function(time) {
    //this.node.setRotation(time * 0.00001, -time * 0.0002, Math.PI / 4);

    // We request an update from the node on the next frame.
    //this.node.requestUpdate(this.id);
};


// The Layout component is a state machine. Each layout can is a state.
// The state is defined by
// 1. spacing: The dot spacing.
// 2. randomizePositionZ: Whether the x position should be randomized.
// 3. curve: The easing curve used to enter the state.
// 4. duration: The duration of the animation used for transitioning to the
//      state.
Layout = function(node) {
    this.node = node;
    this.id = this.node.addComponent(this);
    this.current = 0;
    // Dot layout -> Square layout -> Square layout with random Z
    // -> Expanded square -> Square layout
    this.spacing = [ +DOT_SIZE, -DOT_SIZE*3, 0, 20, 0 ];
    this.randomizePositionZ = [ false, false, true, false, true ];
    this.curve = [ Famous.Curves.outQuint, Famous.Curves.outElastic, Famous.Curves.inElastic, Famous.Curves.inOutEase, Famous.Curves.inBounce ];
    this.duration = [ 700, 3000, 3000, 1000, 700 ];

    // Transitions to initial state.
    this.next();
}

// Transitions to the next state.
// Called by node.
Layout.prototype.next = function next() {
    if (this.current++ === 4) this.current = 0;

    var spacing = this.spacing[this.current];
    var randomizePositionZ = this.randomizePositionZ[this.current];
    var duration = this.duration[this.current];
    var curve = this.curve[this.current];

    var row = 0;
    var col = 0;
    var dimension = (spacing + DOT_SIZE);
    var bounds = [-(((dimension) * 6 / 2) - (dimension / 2)), -(((dimension) * 6 / 2) - (dimension / 2))];
    for (var i = 0; i < this.node.getChildren().length; i++) {
        var polarity = Math.random() < 0.5 ? -1 : 1;
        var x = bounds[0] + ((dimension) * col++);
        var y = bounds[1] + ((dimension) * row);
        var z = (randomizePositionZ) ? Math.floor(Math.random() * 80) * polarity : 0;
        this.node.dots[i].position.set(x, y, z, {
            duration: i*10 + duration,
            curve: curve
        });
        if (col >= 6) {
            col = 0;
            row++;
        }
    }
};

Template.transformsGrid.onDestroyed(function(){
  console.log("Removing TransformGrid");
  //$('#famousScene .famous-dom-renderer').remove();
  //$('#famouseScene .famous-webgl-renderer').remove();
});




// Helper function used for generating the color pallet used for styling the
// dots.
createColorStep = function(step) {
    step -= (step >= COLOR_STEPS) ? COLOR_STEPS : 0;
    var r = COLORS[0][0] - Math.round(((COLORS[0][0] - COLORS[1][0]) / COLOR_STEPS) * step);
    var g = COLORS[0][1] - Math.round(((COLORS[0][1] - COLORS[1][1]) / COLOR_STEPS) * step);
    var b = COLORS[0][2] - Math.round(((COLORS[0][2] - COLORS[1][2]) / COLOR_STEPS) * step);
    return 'rgb(' + r + ',' + g + ',' + b + ')';
}
