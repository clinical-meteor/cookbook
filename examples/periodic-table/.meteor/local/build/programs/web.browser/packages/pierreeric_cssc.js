//////////////////////////////////////////////////////////////////////////
//                                                                      //
// This is a generated file. You can view the original                  //
// source in your browser if your browser supports source maps.         //
//                                                                      //
// If you are using Chrome, open the Developer Tools and click the gear //
// icon in its lower right corner. In the General Settings panel, turn  //
// on 'Enable source maps'.                                             //
//                                                                      //
// If you are using Firefox 23, go to `about:config` and set the        //
// `devtools.debugger.source-maps-enabled` preference to true.          //
// (The preference should be on by default in Firefox 24; versions      //
// older than 23 do not support source maps.)                           //
//                                                                      //
//////////////////////////////////////////////////////////////////////////


(function () {

/* Imports */
var Meteor = Package.meteor.Meteor;

/* Package-scope variables */
var __coffeescriptShare;

(function () {

///////////////////////////////////////////////////////////////////////////////////
//                                                                               //
// packages/pierreeric:cssc/cssc.coffee.js                                       //
//                                                                               //
///////////////////////////////////////////////////////////////////////////////////
                                                                                 //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;

/*
CSSC: CoffeeScript's StyleSheet.
@example
  stylesheet = new CSSC
  CSSC.add 'html',
    backgroundColor: 'red'
 */
this.CSSC = (function() {

  /*
  Static method for creating percentage strings.
  @param  {Number} val Value set in the string.
  @return {String}     Stringified value with percentage.
   */
  CSSC.pc = function(val) {
    return "" + val + "%";
  };


  /*
  Static method for creating pixel strings.
  @param  {Number} val Value set in the string.
  @return {string}     Stringified value with pixel.
   */

  CSSC.px = function(val) {
    return "" + val + "px";
  };


  /*
  Static method for creating em strings.
  @param  {Number} val Value set in the string.
  @return {string}     Stringified value with em.
   */

  CSSC.em = function(val) {
    return "" + val + "em";
  };


  /*
  C-tor creating a StyleSheet.
  @return {CSSC} The GhostTag's StyleSheet.
   */

  function CSSC() {
    var style;
    style = document.createElement('style');
    style.setAttribute('media', 'screen');
    style.appendChild(document.createTextNode(''));
    document.head.appendChild(style);
    this.sheet = style.sheet;
  }


  /*
  Add a CSSRule to the current StyleSheet.
  @param {String} or {Array} tags A single tag / class or and Array of srings.
  @param {Object} properties A dictionnay of CSS's properties.
  @return {CSSC} The GhostTag's StyleSheet, allowing chaining.
   */

  CSSC.prototype.add = function(tags, properties) {
    var idx, key, rule, tag, val, _i, _len;
    if (typeof tags === 'string') {
      tags = [tags];
    }
    for (_i = 0, _len = tags.length; _i < _len; _i++) {
      tag = tags[_i];
      idx = this.sheet.insertRule("" + tag + " {}", this.sheet.cssRules.length);
      rule = this.sheet.cssRules[idx];
      for (key in properties) {
        val = properties[key];
        rule.style[key] = val;
      }
    }
    return this;
  };

  return CSSC;

})();
///////////////////////////////////////////////////////////////////////////////////

}).call(this);


/* Exports */
if (typeof Package === 'undefined') Package = {};
Package['pierreeric:cssc'] = {};

})();
