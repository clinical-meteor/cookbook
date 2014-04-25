### Settings > File and Code Templates

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

### Settings > Live Templates

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

