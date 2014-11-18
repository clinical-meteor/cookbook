## Core Dependencies  

**Q:  Is jQuery a core package?**  
Basically, yes.  It's a dependency of Blaze, and is included in pretty much all core applications.  In the new [Blaze UI, jQuery is used for event handling](https://github.com/meteor/meteor/wiki/Using-Blaze#events-use-jquery). If you go through the effort of writing your own DDP client or exposing a REST interface with Iron-Router, you could use another front-end templating library that maybe doesn't use jQuery.  Otherwise, assume it's a core package.

**Q:  I'm looking in myapp/.meteor/packages, and I don't see jQuery listed.  Why does my app act like it's loading jQuery?**  
Because it's a dependency of Blaze.  The ``.meteor/packages`` file only lists top level dependencies, and not sub-dependencies.  Check the ``.meteor/versions`` file to find the jquery reference.

=========================================
#### Dependency Load Ordering

Something that really trips people up a lot with Meteor is load ordering and dependencies, particularly if they're accustomed to sequential or imperative style programming (i.e. coming from object-oriented languages and frameworks).  Meteor is a lot of things, and one of the most important aspects of Meteor is that it provides **a development pipeline** to you as a developer.  When you use the ``meteor`` and ``meteor create`` and ``meteor deploy`` commands, you're actually running a whole slew of other commands and tasks in the background, which prepare your application for development, stage databases, bundle and optimize code, and so forth.  And for many people who are accustomed to simply copying a directory of files to a server and have them hosted, this pipeline is a new type of development.

The major thing to keep in mind is that the code you write isn't the code that gets delivered to the server.  There's a process called 'bundling' which is part of the deployment process, and it includes the gather and minification and optimization of all your javascript files, html files, and css files.  When it does this, the Meteor bundler will combine your files according to two rules:  

First, it includes files that are deepest in your directory stucture first.  
Second, it will read in files alphabetically.

As it parses through your files, it does various optimizations and minifications to make your application run faster and to standardize it for Node hosting environments.  In doing this parsing, it will parse the files according to the two rules mentioned above.  Therefore, if you've written your code such that the order of files is important, your app will break.  So, the challenge is to learn how to write your code so that it can be moved around and put anywhere in the application directory and still work.  

Can that be done?  Absolutely.  Mostly, you just have to be cautious about wrapping all your code in Meteor APIs, encapsulating your code in well formed objects (or creating global variables and functions, for those of you willing to make peace with and embrace the global namespace).  Once you figure out those few conventions, load ordering will become a non-issue.

````js
// the bundling process output is such that libraries in the deepest directories will be loaded first    
/client/lib/deepest/folder/library-first.js  
/client/lib/deeper/library-second.js  
/client/lib/deeper/library-third.js  
/client/lib/library-fourth.js  

// and libraries in the root directory will be loaded last
/client/library-fifth.js  

// meteor then bundles and deploys
````
=========================================
#### 3rd Party Libraries    

**Q:  How do I add dependencies?**  
If you haven't run across Meteorite and Atmosphere and the mrt command utility, do some research on those terms.  In the /usr/loca/meteor/packages directory, you'll find all the source code for the packages themselves, and take a gander at the package.js files.  Those, in conjunction with the 'meteor add package-name' syntax is how Meteor handles much of the dependency type stuff.  Of course, the dependency management requires that a package is built in the first place.  
http://atmosphere.meteor.com  

=========================================
#### Getting 3rd-party-library.js to work with Meteor  

Getting 3rd party libraries used to be a lot harder with the older Spark opt-out rendering model.  Nowdays, with Blaze's opt-in model, things are much easier.  But the order-of-sequence is decidedly non-linear and can be quite confusing at first.  The following example shows how to wrap a third-party table-sorting library in a reactive Tracking object.  The Blaze template renders a table of posts from the Posts collection, and the Tracker object reruns the tablesorter() function whenever new data arrives to the minimongo cursor.  The end result being that, as data is received from the server, the client will update the table and sort it with our 3rd part library.

**Note:  the non-sequential ordering here (4,3,1,2,5,6,7) is correct.  Follow the steps in order...  1,2,3,4,5,6,7 to follow how this gets parsed. Be mindful of steps three and four, which are particularly tricky, as step 4 is what is known as a side-effect.  If it doesn't make sense, reread and study it until it does.

    ````js
    Session.setDefault('receivedData', null);
    
    Template.postsTablePage.helpers({
      postsList: function(){
        // step 4:  everything within the customersList gets rerun
        // which causes another session variable to be set
        Session.set('receivedData', new Date());
        
        // step 3:  minimongo receives data and sets the functions referencing the reactive
        // CustomersAccount cursor as being invalidated, which causes them to rerun
        return Posts.find();
      },
      rendered: function(){
        // step 1:  the rendered function is a singleton and only gets run once
        // which is where we create our table using our third party library
        $('#postsTable').tablesorter();
        
        // setp 2:  in the singleton, we're going to opt-into some reactive dependency
        // which will continue after the singleton finishes
        Tracker.autorun(function(){
          // step 5:  the reacitve receivedData session variable is updated, causing the functions
          // referencing it to become invalidated, and for them to be rerun as well
          console.log(Session.get('receivedData'))
          
          // step 6:  we wait a couple of milliseconds to let the cursor populate the table
          setTimeout(function(){
            // step 7:  we call an update function on our third party library
            $("#postsTable").trigger("update");
          }, 100);
        });
      }
    });
    ```



Note: to get third party libraries to work, you'll also want to audit them for `var` keywords.  Unlike most other Javascript frameworks, Meteor uses the 'var' keyword in a very specific way to restrict the scope of a variable to a single file.  Actually, what's happening is that, behind the scenes, every Meteor application is wrapped in an application object.  The Meteor API is simply (and strictly) defined as the functions exposed on the Meteor object, which itself acts as the parent container for your app.  That means that most all of the javascript you write in Meteor apps aren't in the global scope.  Rather, they are in the Meteor scope.  And that causes the behavior of the `var` keyword to change.  

So, many libraries will use the 'var' keyword to simply define a variable to the global scope; thinking that they're going to be run in the global scope as part of a basic static web page.  But Meteor will interpret the 'var' to mean a variable specific to the local file, since it's running the library as a resource in a web application.  This causes problems sometimes.  So, when using the 'var' keyword, keep the following things in mind...

````js
// variable restricted to local file
var foo = 42;

// variable shared between files
foo = 42;

// bad; function restricted to local scope
// source of lots of frustration and broken applications
var createStoryJS = function (){ ... }

// less bad; not explicitely restricted because of the 'var' keyword
// but still restricted to local scope because of synxtax
// still breaks many things
function createStoryJS(){ ... }

// good; function can be shared between files
createStoryJS = function (){ ... }
````

Note:  The Meteor Cookbook is being judgemental here, and saying certain approaches are 'good' and 'bad', which implies certain ways of coding things.  If you're used to using ``private`` and ``public`` keywords, you'll note that the ``var`` keyword acts like ``private``, and can be useful for encapsulation and preventing internal variables from being shared with outside scopes.  That's a good thing.   Proper encapsulation and scoping should be encouraged.  But for people debugging applications and trying to integrate 3rd party libraries, the default usage of the ``var`` keyword breaks a lot of things, and the bottom line is that they generally need to bring some of the private variables into a more global context.
