//==============================================================================
// the following is a REST API that only uses the POST portion of the HTTP protocol
// and is suitable for automated browser testing

// be aware that POSTS refers to the HTTP protocol
// while 'posts' and 'Posts' refers to the weblog example used in the Meteor Cookbook
// this particular example has a slight bit of name-collision occurring


// api:      http://localhost:3000/api/find/posts
// example:  http://localhost:3000/api/find/posts
Router.route('/api/find/posts', function(){
  this.response.statusCode = 200;
  this.response.setHeader("Content-Type", "application/json");
  this.response.setHeader("Access-Control-Allow-Origin", "*");
  this.response.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  this.response.end('Found some posts...  ' + JSON.stringify(
    Posts.find().fetch()
  ));
}, {where: 'server'});


// api:      http://localhost:3000/api/insert/post
// example:  http://localhost:3000/api/insert/post
Router.route('/api/insert/post', function(){
  this.response.statusCode = 200;
  this.response.setHeader("Content-Type", "application/json");
  this.response.setHeader("Access-Control-Allow-Origin", "*");
  this.response.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  this.response.end('New post has an ID of ' + JSON.stringify(
    Posts.insert(this.request.body)
  ));
}, {where: 'server'});


// api:      http://localhost:3000/api/find/post/:postId
// example:  http://localhost:3000/api/find/post/314159
Router.route('/api/find/post/:postId', function(){
  this.response.statusCode = 200;
  this.response.setHeader("Content-Type", "application/json");
  this.response.setHeader("Access-Control-Allow-Origin", "*");
  this.response.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  this.response.end('Post contents... ' + JSON.stringify(
    Posts.findOne({_id: this.params.postId })
  ));
}, {where: 'server'});



// api:      http://localhost:3000/api/update/post/:postId
// example:  http://localhost:3000/api/update/post/314159
Router.route('/api/update/post/:postId', function(){
  this.response.statusCode = 200;
  this.response.setHeader("Content-Type", "application/json");
  this.response.setHeader("Access-Control-Allow-Origin", "*");
  this.response.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  this.response.end('Result of updating post is ' + JSON.stringify(
    Posts.update({_id: this.params.postId },{$set:{
      title: this.request.body.title,
      text: this.request.body.text
    }})
  ));
}, {where: 'server'});


// api:      http://localhost:3000/api/delete/post/:postId
// example:  http://localhost:3000/api/delete/post/314159
Router.route('/api/delete/post/:postId', function(){
  this.response.statusCode = 200;
  this.response.setHeader("Content-Type", "application/json");
  this.response.setHeader("Access-Control-Allow-Origin", "*");
  this.response.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  this.response.end('Result of deleting post is ' + JSON.stringify(
    Posts.remove({_id: this.params.postId })
  ));
}, {where: 'server'});
