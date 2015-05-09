Animations  
========================================

There are two approaches to creating animations:  the first is with with CSS in the View/Presentation layer; the second is with Javascript in the Controller/Application layer.  On the one hand, using CSS3 transforms gets you GPU optimized performance and mostly flicker-free animations, at the price of relying on a subsystem that's maybe over-engineered and constrained to element transformations.  On the other hand, using Javascript and SVG will get you beautiful data-driven animations using D3.js.  But they are very tricky and fickle to create.

----------------------------------------
#### _uihooks   


https://github.com/gwendall/meteor-ui-hooks  
https://github.com/gwendall/meteor-template-animations  
http://template-animations.meteor.com/  

https://groups.google.com/forum/#!msg/meteor-core/1kUoG2mcaRw/j4bNvXu36IoJ
https://github.com/tmeasday/transition-helper/blob/master/transition-helper.js
https://gist.github.com/benstr/1ed39b35bb0b8e4c5de6

----------------------------------------
#### Animations in the View/Presentation Layer    
For basic GPU accelerated animations using CSS3 transforms, start with the following links and references.  

[3D Transforms with Webkit](https://www.webkit.org/blog/386/3d-transforms/)  
[Hands On: 3D Transforms](http://ie.microsoft.com/testdrive/Graphics/hands-on-css3/hands-on_3d-transforms.htm)  
[A Very Short Intro to CSS3D Transforms](http://bartaz.github.io/meetjs/css3d/)  
[Browser Support for 2D Transforms](http://css3.bradshawenterprises.com/transforms/)  
[Intro to CSS 3D Transforms](http://desandro.github.io/3dtransforms/)  

----------------------------------------
#### Audit Your CSS!  
Once you've covered some of the basics, dig deeper into start-of-the-art animation research with these videos from Steve Newcomb, of [Famo.us](http://famo.us/).  Famo.us is positioning itself to be a Javascript alternative to the Flash and Unity rendering engines.

  http://www.youtube.com/watch?v=83MX4wsoMzU  
  https://www.youtube.com/watch?v=br1NhXeVD6Y  
  https://www.youtube.com/watch?v=ixASZtHYGKY  
  https://www.youtube.com/watch?v=zpebYhm8f2o  
  https://www.youtube.com/watch?v=OhfI2wFNKFQ  


----------------------------------------
#### Meteor UI & Famo.us?
Yup!  They've recently announced a partnership to bring 60fps DOM manipulations to Meteor, using CSS matrix overrides!  <3  

https://groups.google.com/forum/#!searchin/meteor-talk/famo.us/meteor-talk/LCZvyy99KiY/uTSYivlicH4J  


Famo.us Render Tree  
https://github.com/Famous/guides/blob/master/dev/2014-04-09-render-tree.md  

Famo.us Documentation  
https://github.com/Famous/guides/tree/master/dev

### Advanced Interaction Design  
http://www.google.com/design/spec/animation/meaningful-transitions.html#meaningful-transitions-visual-continuity

-----------------------------------------
#### CSS Animations and Transitions  

````css



/*
----------------------------------------------------------------------------------------
small icon bump
*/

.icon:hover{
  position: absolute;
  text-align: left;
  top: 5px;
  left: 0;
  width: 48px;
  padding: 0 14px;
  margin: 0 auto;
  height: 90px;
  font-size: 48px;
  line-height: 67px;
  -webkit-transition-property: line-height;
  -moz-transition-property: line-height;
  -ms-transition-property: line-height;
  -o-transition-property: line-height;
  transition-property: line-height;
  -webkit-transition-duration: .08s;
  -moz-transition-duration: .08s;
  -ms-transition-duration: .08s;
  -o-transition-duration: .08s;
  transition-duration: .08s;
  -webkit-transition-timing-function: linear;
  -moz-transition-timing-function: linear;
  -ms-transition-timing-function: linear;
  -o-transition-timing-function: linear;
  transition-timing-function: linear;
  -webkit-transition-delay: 0s;
  -moz-transition-delay: 0s;
  -ms-transition-delay: 0s;
  -o-transition-delay: 0s;
  transition-delay: 0s;
}

/*
----------------------------------------------------------------------------------------
fadeIn - requires class swap
*/

.start-hidden {
  opacity: 0;
  -webkit-transition: opacity 200ms ease-in 200ms;
  -moz-transition: opacity 200ms ease-in 200ms;
  -o-transition: opacity 200ms ease-in 200ms;
  transition:  opacity 300ms ease-in 200ms;
}
.fade-in{
  opacity:1;
}

/*
----------------------------------------------------------------------------------------
fadeIn - automatic
*/
.start-hidden {
  //opacity: 0;
  // -webkit-transition: opacity 500ms ease-in 500ms !important;
  // -moz-transition: opacity 500ms ease-in 500ms !important;
  // -o-transition: opacity 500ms ease-in 500ms !important;
  // transition:  opacity 500ms ease-in 500ms !important;

  -webkit-animation: fadein 5s;
  -moz-animation: fadein 5s;
  -ms-animation: fadein 5s;
  -o-animation: fadein 5s;
  animation: fadein 5s;
}

@keyframes fadein{
  from {opacity: 0;}
  to {opacity: 1;}
}
@-moz-keyframes fadein{
  from {opacity: 0;}
  to {opacity: 1;}
}
@-webkit-keyframes fadein{
  from {opacity: 0;}
  to {opacity: 1;}
}
@-ms-keyframes fadein{
  from {opacity: 0;}
  to {opacity: 1;}
}
@keyframes fadein{
  from {opacity: 0;}
  to {opacity: 1;}
}
@-o-keyframes fadein{
  from {opacity: 0;}
  to {opacity: 1;}
}

/*
----------------------------------------------------------------------------------------
content overlay
*/

.applicationLayout.content-overlay {
 position: absolute;
 top: 0;
 right: 0;
 bottom: 0;
 left: 0;
 width: auto;
 height: auto;
 cursor: pointer;
}
 
@media screen and (min-width: 768px)
  .applicationLayout.content-overlay.open {
  -webkit-transform: translate3d(20%, 0, 0) scale(0.5);
  -moz-transform: translate3d(40%, 0, 0) scale(0.85);
  -o-transform: translate3d(40%, 0, 0) scale(0.85);
  -ms-transform: translate3d(40%, 0, 0) scale(0.85);
  transform: translate3d(40%, 0, 0) scale(0.85);
  z-index: 1;
}


/*
----------------------------------------------------------------------------------------
generic fadein/fadeout
*/

.fluidfade {
  opacity: 0;
  -webkit-transition: all 200ms ease-in;
  -moz-transition: all 200ms ease-in;
  -o-transition: all 200ms ease-in;
  transition:  all 200ms ease-in;
}

````


TODO: Add more CSS animations.
https://github.com/grigio/todomvc-meteor-react/blob/master/client/example-animation.css
https://github.com/grigio/todomvc-meteor-react/blob/master/client/vendor/animate.css
