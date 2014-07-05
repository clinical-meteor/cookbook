### Core Dependencies  
**Q:  Is jQuery a core package?**  
Basically, yes.  It's a dependency of Blaze, and is included in pretty much all core applications.  In the new [Blaze UI, jQuery is used for event handling](https://github.com/meteor/meteor/wiki/Using-Blaze#events-use-jquery). If you go through the effort of writing your own DDP client or exposing a REST interface with Iron-Router, you could use another front-end templating library that maybe doesn't use jQuery.  Otherwise, assume it's a core package.

**Q:  I'm looking in myapp/.meteor/packages, and I don't see jQuery listed.  Why does my app act like it's loading jQuery?**  
Because it's a dependency of Blaze.  The ``.meteor/packages`` file only lists top level dependencies, and not sub-dependencies.  

### Dependency Load Ordering

Something that really trips people up a lot with Meteor is load ordering and dependencies, particularly if they're accustomed to sequential or imperative style programming (i.e. coming from object-oriented languages and frameworks).  Meteor is a lot of things, and one of the most important aspects of Meteor is that it provides **a development pipeline** to you as a developer.  When you use the ``meteor`` and ``meteor create`` and ``meteor deploy`` commands, you're actually running a whole slew of other commands and tasks in the background, which prepare your application for development, stage databases, bundle and optimize code, and so forth.  And for many people who are accustomed to simply copying a directory of files to a server and have them hosted, this pipeline is a new type of development.

The major thing to keep in mind is that the code you write isn't the code that gets delivered to the server.  There's a process called 'bundling' which is part of the deployment process, and it includes the gather and minification and optimization of all your javascript files, html files, and css files.  When it does this, the Meteor bundler will combine your files according to two rules:  

First, it includes files that are deepest in your directory stucture first.  
Second, it will read in files alphabeticallys.

As it parses through your files, it does various optimizations and minifications, to make your application run faster and to standardize it to Node hosting environments.  In doing this parsing, it will read the files in according to those two rules.  And if you've written your code such that the order of files is important, your app will break.  So, the challenge is to learn how to write your code so that it can be moved around and put anywhere in the application directory and still work.  

Can that be done?  Absolutely.  Mostly, you just have to be cautious about wrapping all your code in Meteor APIs or encapsulating your code in well formed objects.

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

### 3rd Party Libraries    

**Q:  How do I add dependencies?**  
If you haven't run across Meteorite and Atmosphere and the mrt command utility, do some research on those terms.  In the /usr/loca/meteor/packages directory, you'll find all the source code for the packages themselves, and take a gander at the package.js files.  Those, in conjunction with the 'meteor add package-name' syntax is how Meteor handles much of the dependency type stuff.  Of course, the dependency management requires that a package is built in the first place.  
http://atmosphere.meteor.com  

**Q: How do I get 3rd-party-library.js work with Meteor?**  

Installing a 3rd party library doesn't have to be hard.  If you're having problems, it's probably because the reactive templates are overwriting the objects you created.  There are a few ways to deal with this:

1.  Move your code out of reactive templates.  Autorun() is a good event hook for creating objects in.

    ```js
    Deps.autorun(function(){  
        // the timeline object is outside the scope of any reactive templates
        timeline = new Timeline();            
    });
    ```


2.  check to see if your object already exists
    ```js
    Template.templateWithConstantRegion.rendered = function(){
      // we simply add feature detection to see if the object already exists 
      self.node = self.find("#timelineObject");
      if (! self.handle) {
        // don't get worked up about this Deps.autorun()
        // it's an option addition to this pattern
        self.handle = Deps.autorun(function(){
            Timeline();            
        });
      };
    };

    // don't forget to complete the pattern by tearing down the object properly
    Template.templateWithConstantRegion.destroyed = function () {
      this.handle && this.handle.stop();
    };
    ```

3.  use a ``#constant`` region or a ``Template.frontPage.preserve()`` callback
    ```html
    <temlate name="templateWithConstantRegion">
      <div>
        {{#constant}}
          <div id="timelineObject"></div>
        {{/contant}}
      </div>
    </template>
    ```


4.  You'll also want to check for `var` keywords in your library.  Unlike most other Javascript frameworks, Meteor uses the 'var' keyword in a very specific way to restrict the scope of a variable to a single file.  So, many libraries will use the 'var' keyword to simply define a variable to the global scope; but Meteor will interpret the 'var' to mean a variable specific to the local file.  This causes problems sometimes.

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

Note:  I'm being judgemental here, and saying certain approaches are 'good' and 'bad', which implies certain ways of coding things.  If you're used to using ``private`` and ``public`` keywords, you'll note that the ``var`` keyword acts like ``private``, and can be useful for encapsulation and preventing internal variables from being shared with outside scopes.  That's a good thing.   Proper encapsulation and scoping should be encouraged.  But for people debugging applications and trying to integrate 3rd party libraries, the default usage of the ``var`` keyword breaks a lot of things, and the bottom line is that they generally need to bring some of the private variables into a more global context.
