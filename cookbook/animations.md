 
### Animations  
There are two approaches to creating animations:  either with CSS in the View/Presentation layer, or via Javascript in the Controller/Application layer.  

Using CSS3 transforms will allow you to run things on the GPU, and is generally the easiest way to get flicker-free animations.  But be careful!  Be sure to audit your CSS files!  

However, with Javascript and SVG, you can build beautiful data-driven animations using D3.js.  But they are very tricky and fickle to create.

### Animations in the View/Presentation Layer    
For basic GPU accelerated animations using CSS3 transforms, start with the following links...  

https://www.webkit.org/blog/386/3d-transforms/  
http://ie.microsoft.com/testdrive/Graphics/hands-on-css3/hands-on_3d-transforms.htm  
http://bartaz.github.io/meetjs/css3d/  
http://css3.bradshawenterprises.com/transforms/  
http://desandro.github.io/3dtransforms/  

### Audit Your CSS!  
Check out the following videos by Steve Newcomb, from Famo.us, regarding the importance of auditing your CSS libraries.  

  http://www.youtube.com/watch?v=83MX4wsoMzU  
  https://www.youtube.com/watch?v=br1NhXeVD6Y  
  https://www.youtube.com/watch?v=ixASZtHYGKY  
  https://www.youtube.com/watch?v=zpebYhm8f2o  
  https://www.youtube.com/watch?v=OhfI2wFNKFQ  

### Meteor UI & Famo.us?
Yup!  They've recently announced a partnership to bring 60fps DOM manipulations to Meteor, using CSS matrix overrides!  <3  
https://groups.google.com/forum/#!searchin/meteor-talk/famo.us/meteor-talk/LCZvyy99KiY/uTSYivlicH4J  


Famo.us Render Tree  
https://github.com/Famous/guides/blob/master/dev/2014-04-09-render-tree.md  

Famo.us Documentation  
https://github.com/Famous/guides/tree/master/dev


-----------------------------------------

### CSS Animations and Transitions  

````less
/*----------------------------------------------------------------------------------------
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


// ----------------------------------------------------------------------------------------
// fadeIn
 
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

// ----------------------------------------------------------------------------------------
// fadeIn

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
````


TODO: Add more CSS animations.
