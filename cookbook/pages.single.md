## Single Page Example

##### File structure 
````sh
/client/views/page.home.less
/client/models/page.home.html
/client/controllers/page.home.js
````
 
##### The Document Object Model    
````html
<!-- /client/models/page.home.html -->
<template name="homePage">
  <div id="homePage" class="page">
    <h2>{{ getTitle }}<h2>
    <p class="tagline">{{ getText }}<p>
    <!-- insert code here-->
  </div>
</template>
````
But wait! you might be saying.  There's so much redundancy!  We've repeated the term 'page' in both template names, div containers, and filenames!  That sort of duplication confuses things.  Well, maybe it does, and maybe it doesn't.  There is, indeed a bit of redundancy going on.  However, I suggest this approach because it will eventually lead to code-completion functionality in IDEs and refactoring tools.  


##### The View    
````scss
// client/views/page.home.less
// the page class allows us to modify all the pages at the same time
.page{
  margin-top: 50px;
  margin-bottom: 50px;
}
// while the page id allows us to scope CSS styles to specific pages using namespacing
// note: the following example uses the LESS package and precompiler  
#homePage{
  h2{
    color: blue;
  }
  .tagline{
   color: gray;
  }
}
````

The controller is fairly straight forward.  
##### The Controller   
````js
// client/views/page.home.js 
Template.homePage.getTitle = function(){
 return "Hello World";
}
Template.homePage.getText = function(){
 return "lorem ipsum, dolar sit amet...";
}
````
