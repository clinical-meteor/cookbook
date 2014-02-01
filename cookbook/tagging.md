## Tagging

**Q:  How do I add hashtags functionality?**  


### UI Dependencies
For this example, we're goign to use Bootstrap 3, Font Awesome, and the Less precompiler.  So be sure to run the following from the command prompt:

````sh
  mrt add bootstrap-3
  mrt add font-awesome
  meteor add less
````


### The Database Layer
First, we want to set up the necessary Data Distribution Protocol controllers, to make sure that we can persist data to the database, and get it in the client.  Three files need to be created... one on the server, one on the client, and one shared between both.  

````js
// client/subscriptions.js
Meteor.subscribe('posts');

//lib/model.js
Posts  = new Meteor.Collection("posts");
Posts.allow({
    insert: function(){
        return true;
    },
    update: function () {
        return true;
    },
    remove: function(){
        return true;
    }
});


// server.publications.js
Meteor.publish('posts', function () {
  return Posts.find();
});
````

This example assumes the following document schema for the tagging pattern:
````js
{
  _id: "3xHCsDexdPHN6vt7P",
  title: "Sample Title",
  text: "Lorem ipsum, solar et...",
  tags: ["foo", "bar", "zkrk", "squee"]
}
````

### The Application Layer

#### Application Object Model
Second, we want to create our object model in the application layer.   The following is how you would use a Bootstrap panel to render a post with title, text, and tags.  Note that ``selectedPost``, ``tagObjects``, and ``tag`` are all helper functions of the blogPost template.  ``title`` and ``text`` are fields from our document record.  

````html
<template name="blogPost">
  {{#with selectedPost }}
    <div class="blogPost panel panel-default">
      <div class="panel-heading">
        {{ title }}
      </div>
        {{ text }}
      <div class="panel-footer">
        <ul class="horizontal-tags">
          {{#each tagObjects }}
          <li class="tag removable_tag">
            <div class="name">{{tag}}<i class="fa fa-times"> X</span></div>
          </li>
          {{/each}}
          <li class="tag edittag">
            <input type="text" id="edittag-input" value="" /><i class="fa fa-plus"> X</span>
          </li>
        </ul>
      </div>
    </div>
  {{/with}}
</template>
````

#### Application Controller
Next, we want to set up some controllers to return data, implement some data input, and so forth.

````js
// you will need to set the selectedPostId session variable 
// somewhere else in your application
Template.blogPost.selectedPost = function(){
  return Posts.findOne({_id: Session.get('selectedPostId')});
}

// next, we use the _.map() function to read the array from our record
// and convert it into an array of objects that Handlebars/Spacebars can parse
Template.blogPost.tagObjects = function () {
    var post_id = this._id;
    return _.map(this.tags || [], function (tag) {
        return {post_id: todo_id, tag: tag};
    });
};

// then we wire up click events 
Template.blogPost.events({
    'click .fa-plus': function (evt, tmpl) {
        Posts.update(this._id, {$addToSet: {tags: value}});
    },
    'click .fa-times': function (evt) {
        Posts.update({_id: this._id}, {$pull: {tags: this.tag}});
    }
});
````

#### Application View (Optional)
Lastly, we want to define some different Views for phone, tablet, and desktops; and some basic UI styling depending on user input.  

````css
// default desktop view
.fa-plus:hover{
  cursor: pointer;
}
.fa-times:hover{
  cursor: pointer;
}
// landscape orientation view for tablets
@media only screen and (min-width: 768px) {
  .blogPost{
     padding: 20px;
  }
}
// portrait orientation view for tablets
@media only screen and (max-width: 768px) {
  .blogPost{
     padding: 0px;
       border: 0px;
  }
}
// phone view
@media only screen and (max-width: 480px) {
  blogPost{
   .panel-footer{
       display: none;
    }
  }
}
````
