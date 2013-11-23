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
````less
// 
.page{
  margin-top: 50px;
  margin-bottom: 50px;
}
````

##### The Controller - /client/views/page.home.js  
````js
Template.homePage.getText = function(){
 return "Hello World";
}
````
