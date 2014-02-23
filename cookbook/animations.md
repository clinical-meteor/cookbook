 
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


### CSS Animations and Transitions  

#### Small Icon Bump  
````css
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
````
