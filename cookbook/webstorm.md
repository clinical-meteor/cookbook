## WebStorm IDE

**Note:  WebStorm is no longer the Meteor-Cookbook recommended Editor or Development Environment.**   
We now recommend [Atom.io](http://www.atom.io) since it's a pure-javascript editor, meaning we can extend the Meteor Isomorphic API to the Editor.  For an early preview, check out [Meteor API Code Snippets for Atom Editor](https://github.com/awatson1978/meteor-api-for-atom-editor).  

================================================
#### Version  
Recommend version of WebStorm is currently ~9.0.  
http://www.jetbrains.com/webstorm/  
http://www.jetbrains.com/webstorm/download/download_thanks.jsp
http://blog.jetbrains.com/webstorm/2014/09/webstorm-9-eap-138-1988-meteor-support-gulp-and-more/

================================================
#### Download the Settings.jar File  
There's now a pre-compiled settings file which you can download and import directly into WebStorm, rather than following all the instructions in this document. It may be slightly out of date vs. this document, though.  
https://github.com/awatson1978/webstorm-settings

================================================
#### Implementing Meteor Styleguide  
https://github.com/meteor/meteor/dwiki/Meteor-Style-Guide  


================================================
#### MVC Color Coding
Run ``meteor add less`` at the command line to include the LESS precompiler.  Then use ``.less`` files instead of ``.css`` files.  Presto.  Your application should color code Model (Green), View (Blue), and Controller (Red) files.



================================================
#### Settings > Code Style > Javascript  
As per the Meteor style guide.  
https://github.com/meteor/meteor/wiki/Meteor-Style-Guide  

````
// Tabs and Indents  
Tab Size: 2  
Indent: 2  
Continuation indent: 2  

// Spaces  (select all options **except** the following)  
Unary operators  
Function call parentheses  
Function declaration parentheses  
'if' parentheses  
'for' parentheses  
'while' parantheses  
'switch' parantheses  
'catch' parantheses  

````

================================================
#### Settings > Directories > Excluded

You want to exclude the ``.meteor`` file so that the Meteor build process doesn't crash your IDE.  This applies to most any IDE you use, and isn't specific to WebStorm.  
````
.idea
.meteor
````


================================================
#### Settings > File and Code Templates

I find it very convenient to create a Less file template, using some default media styles to help with responsive mobile application design.  

**Meteor - Mobile View**  
````css
#guestPage{
  .foo{
    background-color: red;
  }
  .foo:hover{
    text-decoration: underlined;
  }

}

// landscape orientation
@media only screen and (min-width: 768px) {
  #guestPage{
    .foo{
      background-color: blue;
    }
  }
}

// portrait orientation
@media only screen and (max-width: 768px) {
  #guestPage{
    .foo{
      background-color: blue;
    }
  }
}
@media only screen and (max-width: 480px) {
  #guestPage{
    .foo{
      background-color: blue;
    }
  }
}
````


**Meteor - Basic Page Model**  
````html
<template name="fooPage">
  <div id="fooPage" class="page">
    <div class="container">
    
    </div>
  </div>
</template>
````

**Meteor - List Page Controller**  
````js
Template.fooPage.events({
  'click .btn':function(){
    console.count('click .btn);
    alert('click .btn!);
  }
})
Template.fooList.fooList = function(){
  return Foo.find();
}
````

**Meteor - List Page Model**  
````html
<template name="fooPage">
  <div id="fooPage" class="page">
    <div class="container">
      <ul>
      {{each fooList}}
        {{> fooListItem }}
      {{/each}}
      </ul>    
    </div>
  </div>
</template>


<template name="fooListItem">
  <li>
    {{_id}}
  </ulil>
</template>

````

================================================
## Settings > General
"Save files on frame deactivation" and "Save files automatically" - you want this turned **off**.  It conflicts with Meteor's build process, and basically duplicates functionality found in Meteor.  Bundling and live editing will basically conflict with each other.

In older versions, thse could be found under Preferences > Live Edit.

================================================
#### Settings > Editor > Editor Tabs
Enable "Mark modified tabs with asterisk"


================================================
#### Settings > Javascript > Code Quality Tools > JSLint

````
+ Enable
+ Tolerate TODO comments
Indentation 2
````

If [JSLint is too annoyingly strict](http://stackoverflow.com/questions/6803305/should-i-use-jslint-or-jshint-javascript-validation), enable JSHint instead.


================================================
#### Settings > Javascript > Node.js  
````
chai  
demeteorizer  
fs-tools  
istanbul  
laika  
meteorite  
mocha  
phantomjs  
selenium-webdriver  
````


================================================
#### Settings > Version Control > Github

````
Host: github.com  
Login: yourusername  
Password: yourpassword  
````


================================================
#### Settings > Editor 
Editor preferences are going to vary wildly, particularly if you're accustomed to old school editors like Vim or Emacs.  However, if you'd like WebStorm to behave like a typical text editor, I'd recommend setting the following items.  In particular, allow placement of the caret after the end of line can be particularly confusing and frustrating.  
````
- Honor 'CamelHumps'
+ Zoom with Cmd + Mousewheel
+ Use soft wraps in editor
- Allow placement of caret after end of line
+ Allowplacement of caret inside of tabs
````

================================================
#### Preferences > Editor > Appearance
Showing line numbers is obviously a personal preference, but it helps immeasurably in debugging stack traces.  If you're not using line numbers, you're very likely either a n00b or a guru.  Ask yourself if you're a n00b, a guru, or an intermediate programmer, and set accordingly.  
````
+ Show line numbers  
````

================================================
#### Settings > Editor > Color & Fonts > Javascript
Another personal preference, but if you're into reducing eye strain, coding in low-light levels, anord saving energy, try changing to ``Darcula``.


================================================
#### Settings > Live Templates

try/catch block  
````js
try{
  $SELECTION$
}catch(error){
  console.log(error);
}
$END$
````

self.once
````js
  self = this;
  if(! self.once) {
    $SELECTED$
    $END$
  }
  self.once = true;
````

if/else block
````js
if($END$){
    $SELECTION$
}else{

}
````

console.group
````js
console.group('$END$');
$SELECTION$
console.endGroup();
````



bootstrap panel - basic
````js
<div class="panel panel-default">
  <div class="panel-heading">
    $END$  
  </div>
  $SELECTION$
</div>
````


bootstrap panel - complete
````js
<div class="panel panel-default">
  <div class="panel-heading">
    $END$  
  </div>
  $SELECTION$
  <div class="panel-footer">
  </div>
</div>
````

bootstrap panel - minimal
````js
<div class="panel panel-default">
  $SELECTION$
</div>
$END$  
````

new page template
````js
<template name="$END$">
  <div id="newPage" class="page">
    $SELECTION$
  </div>
</template>
````


================================================
#### Settings > Plugins  

If you can't find plugins via the Settings -> Plugins -> Browse Repositories dialog, you can go to http://plugins.jetbrains.com, find the desired plugin, download it, then unpack the .zip into WebStorm's `plugins` directory.

Some useful plugins:

* [Mongo Plugin](https://github.com/dboissier/mongo4idea)
* [Unicode Browser](http://plugins.jetbrains.com/plugin/6186)
* [Code History Mining](http://plugins.jetbrains.com/plugin/7273)
* [Dummy Text Generator](http://plugins.jetbrains.com/plugin/7216)
* [CodeGlance](http://plugins.jetbrains.com/plugin/7275) - minimap similar to the one in Sublime
* [Code Outline 2](http://plugins.jetbrains.com/plugin/6274)
* [Handlebars/Mustache](http://plugins.jetbrains.com/plugin/6884)
* [CamelCase](http://plugins.jetbrains.com/plugin/7160)
* [Git Flow Integration](http://plugins.jetbrains.com/plugin/7315)
* [SyncEdit 2](http://plugins.jetbrains.com/plugin/7147) - expanded word refactoring

Some plugins enabled by default that don't apply to meteor development and you can disable to improve performance:

* Database Support (doesn't support MongDB; use the [Mongo Plugin](https://github.com/dboissier/mongo4idea) instead)
* ASP
* CVS
* Drupal
* Framework MVC Structure
* Google App Engine Support for PHP
* hg4idea
* Java Server Pages
* PHP
* SQL support
* Subversion Integration
* YAML

================================================
#### Debugging

See [How to debug Meteor apps with WebStorm](http://stackoverflow.com/questions/14751080/how-can-i-debug-my-meteor-app-using-the-webstorm-ide).


================================================
#### Webstorm Keeps Crashing! 

Add the myapp/.meteor directory to your ignore list.  Meteor takes your application and goes through a process called bundling, where it prepares to host it as a node.js application.  It uses the .meteor directory as a temp directory, and will try to rebundle whenever there are changes to your code.  If your editor is watching that directory, it can cause your editor to lock up with the constant indexing and bundling. 

````js
// Webstore > Preferences > Directories > Excluded Directories
.meteor
````
