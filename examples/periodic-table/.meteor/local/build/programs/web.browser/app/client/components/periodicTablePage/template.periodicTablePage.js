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
    }), HTML.BR(), "\n        "), "\n      "), "\n      " ];
  }), "\n    "), "\n  ");
}));

})();
