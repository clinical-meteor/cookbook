1) Create a packages folder in the root of your meteor app folder.

2) Clone this repo into the packages folder

3) edit the file .meteor/packages and add the package name famous to the end

meteor will pick it up and install it automatically when you launch your app.


All famous objects  are mapped  into a 'famous' windows namespace.


For example:

 famous.core.FamousEngine
 famous.domRenderables.DOMElement
 famous.components.Align
 famous.components.Camera
 famous.transitions.Curves
 
 
 to use in your code:
 
 var Camera = new famous.components.Camera;
 
 
Have Fun!


