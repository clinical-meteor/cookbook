## Single Page Example



##### File structure 
````sh
/client/app/workflows/home/homePage.less
/client/app/workflows/home/homePage.html
/client/app/workflows/home/homePage.js
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


##### Presentation States    
````scss
// client/home/homePage.less
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

##### The Controller   
The controller is fairly straight forward.  

````js
// client/home/homePage.js 
Template.homePage.helpers({
  getTitle:function(){
    return "Hello World";
  },
  getTitle:function(){
    return "lorem ipsum, dolar sit amet...";
  }
});
````
