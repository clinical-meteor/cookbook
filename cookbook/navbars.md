## Navbars


A very common task is to create responsive navbars and to create action/footer bars that have different controls based on what page a user is on, or what role a user belongs to.  Lets go over how to make these controls.  

========================================
#### Action/Footer Bars

````js
Template.registerHelper("hasPostsControls", function(argument) {
  if (Router.current()) {
    if (/posts/.test(Router.current().url)) {
      return true;
    } else if (/add/post/.test(Router.current().url)) {
      return true;
    } else {
      return false;
    }
  }
});
````

````html
<template name="navbarFooter">
  <footer id="navbarFooter">
    <nav id="navbarFooterNav" class="navbar navbar-default navbar-fixed-bottom" role="navigation">
      {{#if isLoggedIn }}
        <ul class="nav navbar-nav">
          {{#if hasPostsControls }}
            <li><a id="addPostLink"><u>A</u>dd Post</a></li>
            <li><a id="editPostLink"><u>E</u>dit Post</a></li>
            <li><a id="deletePostLink"><u>D</u>elete Post</a></li>
          {{/if}}
        </ul>
        <ul class="nav navbar-nav navbar-right">
          <li><a id="helpLink"><u>H</u>elp</a></li>
        </ul>
      {{/if}}
    </nav>
  </footer>
</template>

````
