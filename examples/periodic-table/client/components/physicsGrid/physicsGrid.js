
Router.route('/physics', {
  template: "physicsGrid",
  name: "physicsGrid",
  waitOn: function () {
    return Meteor.subscribe('Elements');
  },
});

physicsEngine = null;

Template.physicsGrid.onRendered(function() {
  console.log("Rendering ListOfSpinners");

  console.log("Famous", Famous);

  Famous.Engine.init();

  physicsEngine = new Famous.PhysicsEngine();
  var grav = new Famous.Gravity3D(null, physicsEngine.bodies, {
      strength: -5e7,
      max: 1000,
      anchor: new Famous.Vec3()
  });
  physicsEngine.add(grav);


  var scene = Famous.Engine.createScene('div#famousScene');
  var rootNode = scene.addChild();


  var peUpdater = scene.addComponent({
      onUpdate: function (time) {
          physicsEngine.update(time);
          scene.requestUpdateOnNextTick(peUpdater);
        }
  });

  scene.requestUpdate(peUpdater);
  var root = scene.addChild();
  var sized = false;
  var hydrogen = {
    atomicMass: "1.00794(4)",
    atomicNumber: 1,
    atomicRadius: 37,
    name: "Hydrogen",
    symbol: "H"
  };
  var element = hydrogen;


  root.addComponent({
      onSizeChange: function (size) {
          if (!sized) {

            Elements.find().forEach(function(element, index){
              Dot(root.addChild(), index, size, element);
            });

            sized = true;
          }
      }
  });




  Dot = function(node, i, sceneSize, element) {
      node.setProportionalSize(1 / 8, 1 / 6)
          .setDifferentialSize(-4, -4);

      /*new Famous.Mesh(node).setGeometry(new Famous.Circle())
                    .setBaseColor(new Famous.Color(createColorStep(i / 18)));*/

      new Phys(node, sceneSize[0] * 1.5 * (i % totalRows) / totalRows,
                     sceneSize[1] * 2.5 * ((((i / totalRows)|0) % totalCols) / totalCols));

      new Famous.DOMElement(node, {
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
  }

  Phys = function(node, x, y) {
      this.id = node.addComponent(this);
      this.node = node;
      this.body = new Famous.Particle({
          mass: 1,
          position: new Famous.Vec3(x, y, 0)
      });
      this.force = new Famous.Spring(null, this.body, {
          period: 1.5,
          dampingRatio: 0.3,
          anchor: new Famous.Vec3(x, y, 0)
      });
      physicsEngine.add(this.body, this.force);
      node.requestUpdate(this.id);
  }
  Phys.prototype.onUpdate = function onUpdate () {
      var pos = this.body.position;
      this.node.setPosition(pos.x, pos.y, pos.z);
      this.node.requestUpdateOnNextTick(this.id);
  }

  /*createColorStep = function(step, isDom) {
    step -= (step >= totalCols) ? totalCols : 0;
    var r = colors[0][0] - Math.round(((colors[0][0] - colors[1][0]) / totalCols) * step);
    var g = colors[0][1] - Math.round(((colors[0][1] - colors[1][1]) / totalCols) * step);
    var b = colors[0][2] - Math.round(((colors[0][2] - colors[1][2]) / totalCols) * step);
    if (isDom) return 'rgb(' + r + ',' + g + ',' + b + ')';
    return [r, g, b];
  }*/

  document.addEventListener('mousemove', function (e) {
      grav.anchor.set(e.pageX, e.pageY);
  });
  document.addEventListener('touchmove', function (e) {
      grav.anchor.set(e.changedTouches[0].pageX, e.changedTouches[0].pageY);
      e.preventDefault();
  });


});



Template.physicsGrid.onDestroyed(function(){
  console.log("Removing PhysicsGrid");
  //$('#famousScene .famous-dom-renderer').remove();
  //$('#famouseScene .famous-webgl-renderer').remove();
  //physicsEngine = null;
});





colors = [ [151, 131, 242], [47, 189, 232] ];
totalCols = 12;
totalRows = 10;

DOT_SIZE = 120;
