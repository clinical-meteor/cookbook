 
## Webstorm



### Links, Installation
Recommend version of WebStorm is currently 7.0.  
http://www.jetbrains.com/webstorm/  
http://www.jetbrains.com/webstorm/download/download_thanks.jsp?os=mac  


### Implementing Meteor Styleguide
https://github.com/meteor/meteor/wiki/Meteor-Style-Guide  


### MVC Color Coding 
Run ``meteor add less`` at the command line to include the LESS precompiler.  Then use ``.less`` files instead of ``.css`` files.  Presto.  Your application should color code Model (Green), View (Blue), and Controller (Red) files.



### Preferences > Code Style > Javascript
As per the Meteor style guide.  
https://github.com/meteor/meteor/wiki/Meteor-Style-Guide  

````
// Tabs and Indents  
Tab Size: 4  
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

### Preferences > Directories > Excluded

You want to exclude the ``.meteor`` file so that the Meteor build process doesn't crash your IDE.  This applies to most any IDE you use, and isn't specific to WebStorm.  
````
.idea
.meteor
````


### Preferences > File and Code Templates

I find it very convenient to create a Less file template, using some default media styles to help with responsive mobile application design.  

**View Template**  
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


**Page Model Template**  
````html
<template name="fooPage">
  <div id="fooPage" class="page">
    <div class="container">
    
    </div>
  </div>
</template>
````


### Preferences > Live Edit  
You want this turned **off**.  It conflicts with Meteor's build process, and basically duplicates functionality found in Meteor.  Bundling and live editing will basically conflict with each other.  


### Preferences > Javascript > Code Quality Tools > JSLint

````
+ Enable
+ Tolerate TODO comments
Indentation 2
````


### Preferences > Javascript > Node.js  
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


### Preferences > Version Control > Github

````
Host: github.com  
Login: yourusername  
Password: yourpassword  
````


### Preferences > Editor 
Editor preferences are going to vary wildly, particularly if you're accustomed to old school editors like Vim or Emacs.  However, if you'd like WebStorm to behave like a typical text editor, I'd recommend setting the following items.  In particular, allow placement of the caret after the end of line can be particularly confusing and frustrating.  
````
+ Honor 'CamelHumps'
+ Use soft wraps in editor
- Allow placement of caret after end of line
+ Allowplacement of caret inside of tabs
````

### Preferences > Editor > Appearance
Showing line numbers is obviously a personal preference, but it helps immeasurably in debugging stack traces.  If you're not using line numbers, you're very likely either a n00b or a guru.  Ask yourself if you're a n00b, a guru, or an intermediate programmer, and set accordingly.  
````
+ Show line numbers  
````

### Preferences > Editor > Color & Fonts > Javascript
Another personal preference, but if you're into reducing eye strain, coding in low-light levels, anord saving energy, try changing to ``Darcula``.



### Preferences > Live Templates




### Refactoring







### Javascript Libraries






### Plugins  
Unicode Browser  
Code History Mining  
Dummy Text Generator  
Mongo Plugin    
CodeGlance  
Code Outline 2  
Handlebars/Mustache  
CamelCase  
Git Flow Integration  
SyncEdit 2  





