(function(){
Template.__checkName("periodicTablePage");
Template["periodicTablePage"] = new Template("Template.periodicTablePage", (function() {
  var view = this;
  return HTML.ARTICLE({
    id: "periodicTablePage",
    "class": "page"
  }, "\n\n    ", HTML.INPUT({
    id: "elementSearchInput",
    type: "text",
    "class": "glass fullwidth form-control",
    placeholder: "search...",
    value: function() {
      return Spacebars.mustache(view.lookup("getElementSearchFilter"));
    }
  }), "\n\n    ", HTML.UL({
    id: "elementImageGrid"
  }, "\n      ", Blaze.Each(function() {
    return Spacebars.call(view.lookup("lists"));
  }, function() {
    return [ "\n      ", HTML.LI({
      "class": "helveticas"
    }, "\n        ", HTML.SPAN({
      "class": "atomicNumberText"
    }, Blaze.View("lookup:atomicNumber", function() {
      return Spacebars.mustache(view.lookup("atomicNumber"));
    })), HTML.BR(), "\n        ", HTML.H1({
      "class": "center"
    }, Blaze.View("lookup:symbol", function() {
      return Spacebars.mustache(view.lookup("symbol"));
    })), "\n        ", HTML.H5({
      "class": "center"
    }, "\n          ", Blaze.View("lookup:name", function() {
      return Spacebars.mustache(view.lookup("name"));
    }), HTML.BR(), "\n          ", Blaze.View("lookup:atomicMass", function() {
      return Spacebars.mustache(view.lookup("atomicMass"));
    }), HTML.BR(), "\n        "), "\n        ", HTML.Comment(' {{#ContainerSurface size=\'[150, 150]\' perspective=500}}\n            {{#Flipper}}\n              {{>Surface target="front" template="flipper_front"\n                class="red-bg" size="[150,150]" align="[.5,.5]" origin="[.5,.5]"}}\n              {{>Surface target="back" template="flipper_back"\n                class="blue-bg" size="[150,150]" align="[.5,.5]" origin="[.5,.5]"}}\n            {{/Flipper}}\n          {{/ContainerSurface}} '), "\n      "), "\n      " ];
  }), "\n    "), HTML.Raw('\n    <footer class="pageFooter">\n      <h3 class="addElementIcon"><i class="fa fa-sun-o"></i></h3>\n    </footer>\n  '));
}));

Template.__checkName("flipper_front");
Template["flipper_front"] = new Template("Template.flipper_front", (function() {
  var view = this;
  return [ "Front\n  ", HTML.SPAN({
    "class": "atomicNumberText"
  }, Blaze.View("lookup:atomicNumber", function() {
    return Spacebars.mustache(view.lookup("atomicNumber"));
  })), HTML.Raw("<br>\n  "), HTML.H1({
    "class": "center"
  }, Blaze.View("lookup:symbol", function() {
    return Spacebars.mustache(view.lookup("symbol"));
  })), "\n  ", HTML.H5({
    "class": "center"
  }, "\n    ", Blaze.View("lookup:name", function() {
    return Spacebars.mustache(view.lookup("name"));
  }), HTML.Raw("<br>"), "\n    ", Blaze.View("lookup:atomicMass", function() {
    return Spacebars.mustache(view.lookup("atomicMass"));
  }), HTML.Raw("<br>"), "\n  ") ];
}));

Template.__checkName("flipper_back");
Template["flipper_back"] = new Template("Template.flipper_back", (function() {
  var view = this;
  return "Back";
}));

})();
