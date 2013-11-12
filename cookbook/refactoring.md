 

------------------------------------------------------------------
### Refactoring

**Q:  How do I choose what way to run a function?**  

1. Include {{foo}} in the "bar" template and then set up Template.bar.foo {...}.
2. Include {{foo}} in the "bar" template and set up Template.bar.helpers including "foo" {...}.
3. Include a Meteor.method of "foo" {...} on the client.

I always use # 1 by default.  When I find myself repeating a chunk of code repeatedly, I refactor and extract the duplicate code into a helper function, as per #2.  I only use #3 in the rare cases when I need the server to trigger something on the client (ie.  almost never; it's usually the other way around; methods on the server, not client).   $0.02



**Q:  Is there a recommended refactoring flow?**  

Sort of.  If you're not accustomed to refactoring, it's basically just moving files and code around, and renaming things.  It's housekeeping and code maintenance.  And between the default MVC model and the Meteor package system, one can work out a basic refactoring flow, that looks like this:

````js
// begin by creating pages in your template, stylesheet, and controller directories
client/templates/page.feature.html        // html files (document object model)
client/stylesheets/page.feature.less      // css/less/styl files (view)
client/controllers/page.feature.js        // js files (controllers)

// when you find some feature you want to consolidate, formalize, or share
// create a directory and move the relevant files into it
client/feature/page.html         
client/feature/page.js           
client/feature/page.less        

// then, when the feature is ready, move it into a package
// and add a package.js file
packages/feature/page.html         
packages/feature/page.js           
packages/feature/page.less  
packages/feature/package.js
````
