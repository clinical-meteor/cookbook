  

#### Server Side REST APIs

https://github.com/EventedMind/iron-router/blob/master/lib/server/router.js 
https://github.com/nooitaf/meteor-cfs-public-folder/blob/master/cfs-public-folder.js  


````js
// this is in the server directory
Router.map(function () {
  this.route("test-page", {path: "test.js", where: "server", action: testAction});
});

var testAction = function() {
  console.log(this.params);
  console.log(this.request);

  this.response.statusCode = 200;
  this.response.setHeader("Content-Type", "application/javascript");
  this.response.end("console.log('hi!');");
};
````

````js
// this is in the server directory
Router.map(function () {
  this.route("test-page", {path: "/post", where: "server", action: getPost});
});

var getPost = function() {
  console.log(this.params);
  console.log(this.request);

  this.response.statusCode = 200;
  this.response.setHeader("Content-Type", "application/javascript");
  this.response.body("foo");
  this.response.end("console.log('hi!');");
};
````



#### References  

**Meteor REST Collection**  
http://stackoverflow.com/questions/13699126/meteor-rest-collection-api-and-auth  



#### Light Weight REST Api

**RestStop 2**  
https://github.com/BeDifferential/reststop2  

**Meteor - Collection API**    
https://github.com/crazytoad/meteor-collectionapi  


#### REST APIs using GridFS

**HTTP Publish**  
https://github.com/CollectionFS/Meteor-http-publish  

**HTTP Methods**  
https://github.com/CollectionFS/Meteor-http-methods  
