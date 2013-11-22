#### Adding Image Assets via Packages
The package file...  
````js
// packages/mybackgrounds/package.js
Package.describe({
  summary: "Adds backgrounds to the application."
});
Package.on_use(function (api) {
  api.add_files('assets/background.jpg', "client", {isAsset: true});
});
````

And then the View class...
````less
body{
  background: url(packages/mybackgrounds/assets/background.jpg) no-repeat center center fixed;
  -webkit-background-size: cover;
  -moz-background-size: cover;
  -o-background-size: cover;
  background-size: cover;
}
````
