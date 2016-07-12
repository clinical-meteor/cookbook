## Navbars


A very common task is to create responsive navbars and to create action/footer bars that have different controls based on what page a user is on, or what role a user belongs to.  Lets go over how to make these controls.  


https://github.com/clinical-meteor/checklist-manifesto/blob/master/webapp/lib/Router.js

========================================
#### Adding Navbars to Pages Using Routes 


````js

Router.route('checklistPage', {
    path: '/lists/:_id',
    onBeforeAction: function() {
      Session.set('selectedListId', this.params._id);
      this.next();
    },
    yieldTemplates: {
      'checklistHeader': {
        to: 'header'
      },
      'checklistFooter': {
        to: 'footer'
      },
      'sidebar': {
        to: 'westPanel'
      },
      'configListModal': {
        to: 'modalA'
      }
    }
  });
````

========================================
#### Create a Navbar Template

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

========================================
#### Define Yields in Your Layout

https://github.com/clinical-meteor/active-layout/blob/master/client/layouts/appLayout/appLayout.html

````html
<template name="appLayout">

  <div id="appLayout" style="{{getAppRightDistance}}">

    <div id="panelSurface" style="{{appSurfaceOffset}} {{getLeftTransform}}">
      <header id="navbarHeader" class="helveticas {{getTheme}}" style="{{getOpacity}} {{isVisible}} {{getNavWidth}} {{getBackgroundColor 'colorE'}} ">
        {{> yield 'header'}}
      </header>

          <div id="mainPanel" class="helveticas layoutPanel" style="{{getTopDistance}} {{getPageWidth}} {{getPageHeight}} {{pageColor}}">
            <div id="contentAnimation">
              {{#each thisArray}}
                {{> yield}}
              {{/each}}
            </div>
          </div>

      <footer id="navbarFooter" class="unselectable {{getTheme}}" style="{{getOpacity}} {{getFooterHeight}} {{getNavWidth}} {{getBackgroundColor 'colorE'}} ">
        {{> yield 'footerActionElements' }}
        <div class="eastLinks">
          {{#if showHelp}}
          <button id="helpBtn">{{getHelpText}}</button>
          {{/if}}
        </div>
      </footer>
    </div>

  </div>


  {{> yield 'modalA'}}
  {{> yield 'modalB'}}
  {{> yield 'modalC'}}
</template>

````
