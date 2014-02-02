##Accordion



````html
<template name="postsAccordian">
  <div class="panel-group" id="postsAccordion">
   {{#each accordianPanelCursor}}
     {{> accordionPanel }}
   {{/each}}
  </div>
</template>
<template name="accordionPanel">
  <div id="panel-{{_id}}" class="panel panel-default">
    <div class="panel-heading">
      <h4 class="panel-title">
        <a data-toggle="collapse" data-parent="#accordion" href="#collapse-{{_id}}">
          {{_id}}
        </a>
      </h4>
    </div>
    <div id="collapse-{{_id}}" class="panel-collapse collapse in">
      <div class="panel-body">
        {{text}}
      </div>
      <div class="panel-footer">
        {{tags}}
      </div>
    </div>
  </div>
</template>
````
