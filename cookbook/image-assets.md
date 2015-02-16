## Image Assets  

[Background Images and Wallpapers](http://hdwallsource.com/)

==========================================
#### Adding Image Assets via Packages
````js
// packages/mybackgrounds/package.js
Package.describe({
  summary: "Adds backgrounds to the application."
});
Package.on_use(function (api) {
  api.add_files('assets/background.jpg', "client", {isAsset: true});
});
````

==========================================
#### Cover Images  
````less
body{
  background: url(packages/mybackgrounds/assets/background.jpg) no-repeat center center fixed;
  -webkit-background-size: cover;
  -moz-background-size: cover;
  -o-background-size: cover;
  background-size: cover;
}

.coverImage{
  object-fit: cover;
}
````

````html
<img src="http://www.mywebsite.com/images/foo.jpt" class="coverImage" alt="foo image" />
````




==========================================
#### Parallax Images  

[Simple Parallax Scrolling Tutorial](https://ihatetomatoes.net/simple-parallax-scrolling-tutorial/)  
[How To Create a Parallax Website](https://ihatetomatoes.net/how-to-create-a-parallax-scrolling-website-part-2/)  
[How to Make a Parallax Website Responsive](https://ihatetomatoes.net/make-parallax-website-responsive/)  


