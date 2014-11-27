## Drop Down Menu  

#### Object Model

````html
<nav class="nav navbar-nav">
  <li class="dropdown">
    <a href="#" class="dropdown-toggle" data-toggle="dropdown">{{getSelectedValue}} <span class="glyphicon glyphicon-user pull-right"></span></a>
    <ul class="fullwidth dropdown-menu">
      <li id="firstOption" class="fullwidth"><a href="#">15 Minutes <span class="glyphicon glyphicon-cog pull-right"></span></a></li>
      <li class="divider"></li>
      <li id="secondOption"><a href="#">30 Minutes <span class="glyphicon glyphicon-stats pull-right"></span></a></li>
      <li class="divider"></li>
      <li id="thirdOption"><a href="#">1 Hour <span class="badge pull-right"> 42 </span></a></li>
      <li class="divider"></li>
      <li id="fourthOption"><a href="#">4 Hour <span class="glyphicon glyphicon-heart pull-right"></span></a></li>
      <li class="divider"></li>
      <li id="fifthOption"><a href="#">8 Hours <span class="glyphicon glyphicon-log-out pull-right"></span></a></li>
    </ul>
  </li>
</nav>

````



#### Controllers  
````js
Template.examplePage.helpers({
  getSelectedValue:function(){
    return Session.get('selectedValue');
  }
});
Template.dropDownWidgetName.events({
  'click #firstOption':function(){
    Session.set('selectedValue', 1);
  },
  'click #secondOption':function(){
    Session.set('selectedValue', "blue");
  },
  'click #thirdOption':function(){
    Session.set('selectedValue', $('#thirdOption').innerText);
  },
  'click #fourthOption':function(){
    Session.set('selectedValue', Session.get('otherValue'));
  },
  'click #fifthOption':function(){
    Session.set('selectedValue', Posts.findOne(Session.get('selectedPostId')).title);
  },
});
````
