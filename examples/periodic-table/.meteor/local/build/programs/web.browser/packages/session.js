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
var _ = Package.underscore._;
var ReactiveDict = Package['reactive-dict'].ReactiveDict;
var EJSON = Package.ejson.EJSON;

/* Package-scope variables */
var Session;

(function () {

/////////////////////////////////////////////////////////////////////////////////
//                                                                             //
// packages/session/session.js                                                 //
//                                                                             //
/////////////////////////////////////////////////////////////////////////////////
                                                                               //
Session = new ReactiveDict('session');                                         // 1
                                                                               // 2
// Documentation here is really awkward because the methods are defined        // 3
// elsewhere                                                                   // 4
                                                                               // 5
/**                                                                            // 6
 * @memberOf Session                                                           // 7
 * @method set                                                                 // 8
 * @summary Set a variable in the session. Notify any listeners that the value // 9
 * has changed (eg: redraw templates, and rerun any                            // 10
 * [`Tracker.autorun`](#tracker_autorun) computations, that called             // 11
 * [`Session.get`](#session_get) on this `key`.)                               // 12
 * @locus Client                                                               // 13
 * @param {String} key The key to set, eg, `selectedItem`                      // 14
 * @param {EJSONable | undefined} value The new value for `key`                // 15
 */                                                                            // 16
                                                                               // 17
/**                                                                            // 18
 * @memberOf Session                                                           // 19
 * @method setDefault                                                          // 20
 * @summary Set a variable in the session if it hasn't been set before.        // 21
 * Otherwise works exactly the same as [`Session.set`](#session_set).          // 22
 * @locus Client                                                               // 23
 * @param {String} key The key to set, eg, `selectedItem`                      // 24
 * @param {EJSONable | undefined} value The new value for `key`                // 25
 */                                                                            // 26
                                                                               // 27
/**                                                                            // 28
 * @memberOf Session                                                           // 29
 * @method get                                                                 // 30
 * @summary Get the value of a session variable. If inside a [reactive         // 31
 * computation](#reactivity), invalidate the computation the next time the     // 32
 * value of the variable is changed by [`Session.set`](#session_set). This     // 33
 * returns a clone of the session value, so if it's an object or an array,     // 34
 * mutating the returned value has no effect on the value stored in the        // 35
 * session.                                                                    // 36
 * @locus Client                                                               // 37
 * @param {String} key The name of the session variable to return              // 38
 */                                                                            // 39
                                                                               // 40
/**                                                                            // 41
 * @memberOf Session                                                           // 42
 * @method equals                                                              // 43
 * @summary Test if a session variable is equal to a value. If inside a        // 44
 * [reactive computation](#reactivity), invalidate the computation the next    // 45
 * time the variable changes to or from the value.                             // 46
 * @locus Client                                                               // 47
 * @param {String} key The name of the session variable to test                // 48
 * @param {String | Number | Boolean | null | undefined} value The value to    // 49
 * test against                                                                // 50
 */                                                                            // 51
                                                                               // 52
/////////////////////////////////////////////////////////////////////////////////

}).call(this);


/* Exports */
if (typeof Package === 'undefined') Package = {};
Package.session = {
  Session: Session
};

})();
