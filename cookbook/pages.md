##### File structure 
````sh
/client
/client/views/page.home.css
/client/models/page.home.html
/client/controllers/page.home.js
/packages
/public/images
/server
````
 
##### The Document Object Model (/client/models/page.home.html)  
````html
<template name="homePage">
  <div id="homePage" class="page">
    <!-- insert code here-->
    {{ getText }}
  </div>
</template>
````

##### The View - /client/views/page.home.css  
````scss
// this is a comment
.page{
  margin-top: 50px;
  margin-bottom: 50px;
}
````

##### The Controller - /client/views/page.home.js  
````js
// this is a comment
Template.homePage.getText = function(){
 return "Hello World";
}
````

But wait! you might be saying.  There's so much redundancy!  We've repeated the term 'page' in both template names, div containers, and filenames!  That sort of duplication confuses things.  

Well, maybe it does, and maybe it doesn't.  There is, indeed a bit of redundancy going on.  However, I suggest this approach because it will eventually lead to code-completion functionality in IDEs and refactoring tools.  
