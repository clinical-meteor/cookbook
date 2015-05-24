(function(){
Template.__checkName("appLayout");
Template["appLayout"] = new Template("Template.appLayout", (function() {
  var view = this;
  return [ HTML.Raw('<!-- {{> navbarHeader}} -->\n  <!-- {{#Scrollview proportions="[.5,1]"}}\n\n    {{#Surface size="[undefined,true]"}}\n      <h1>Scrollview Example</h1>\n    {{/Surface}}\n\n    {{#famousEach items}}\n      {{>Surface template="item" size="[undefined,20]"}}\n    {{/famousEach}}\n\n  {{/Scrollview}} -->\n\n\n    '), HTML.DIV({
    "class": "hidden"
  }, Blaze.View("lookup:resized", function() {
    return Spacebars.mustache(view.lookup("resized"));
  })), HTML.Raw('\n    <div id="backgroundImage"></div>\n\n    '), Spacebars.include(view.lookupTemplate("yield")), HTML.Raw('\n\n    <!-- <button id="homePageBadge" class="leafThemed mega homePageBadge"><i class="fa fa-leaf"></i></button>\n    <button id="tableBadge" class="leafThemed super tableBadge"><i class="fa fa-table"></i></button>\n    <button id="listBadge" class="leafThemed super listBadge"><i class="fa fa-list"></i></button>\n    <button id="backLeafBadge" class="leafThemed super imageGridBadge"><i class="fa fa-th"></i></button> -->\n\n\n    <!-- <div id="transparentPanel" class="container" style="{{getStyle}}"></div>\n    <div id="mainPanel" class="padded container helveticas" style="{{getStyle}}">\n      <div id="innerPanel" class="panel panel-default">\n        {{> yield }}\n      </div>\n    </div> -->\n\n  <!-- {{> navbarFooter}} -->') ];
}));

Template.__checkName("item");
Template["item"] = new Template("Template.item", (function() {
  var view = this;
  return HTML.Raw("<li>\n    Foo?\n  </li>");
}));

})();
