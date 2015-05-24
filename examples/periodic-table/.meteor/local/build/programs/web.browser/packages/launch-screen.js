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
var LaunchScreen;

(function () {

////////////////////////////////////////////////////////////////////////////
//                                                                        //
// packages/launch-screen/mobile-launch-screen.js                         //
//                                                                        //
////////////////////////////////////////////////////////////////////////////
                                                                          //
// XXX This currently implements loading screens for mobile apps only,    // 1
// but in the future can be expanded to all apps.                         // 2
                                                                          // 3
var holdCount = 0;                                                        // 4
var alreadyHidden = false;                                                // 5
                                                                          // 6
LaunchScreen = {                                                          // 7
  hold: function () {                                                     // 8
    if (! Meteor.isCordova) {                                             // 9
      return {                                                            // 10
        release: function () { /* noop */ }                               // 11
      };                                                                  // 12
    }                                                                     // 13
                                                                          // 14
    if (alreadyHidden) {                                                  // 15
      throw new Error("Can't show launch screen once it's hidden");       // 16
    }                                                                     // 17
                                                                          // 18
    holdCount++;                                                          // 19
                                                                          // 20
    var released = false;                                                 // 21
    var release = function () {                                           // 22
      if (! Meteor.isCordova)                                             // 23
        return;                                                           // 24
                                                                          // 25
      if (! released) {                                                   // 26
        holdCount--;                                                      // 27
        if (holdCount === 0 &&                                            // 28
            typeof navigator !== 'undefined' && navigator.splashscreen) { // 29
          alreadyHidden = true;                                           // 30
          navigator.splashscreen.hide();                                  // 31
        }                                                                 // 32
      }                                                                   // 33
    };                                                                    // 34
                                                                          // 35
    // Returns a launch screen handle with a release method               // 36
    return {                                                              // 37
      release: release                                                    // 38
    };                                                                    // 39
  }                                                                       // 40
};                                                                        // 41
                                                                          // 42
////////////////////////////////////////////////////////////////////////////

}).call(this);






(function () {

////////////////////////////////////////////////////////////////////////////
//                                                                        //
// packages/launch-screen/default-behavior.js                             //
//                                                                        //
////////////////////////////////////////////////////////////////////////////
                                                                          //
// Hold launch screen on app load. This reflects the fact that Meteor     // 1
// mobile apps that use this package always start with a launch screen    // 2
// visible. (see XXX comment at the top of package.js for more            // 3
// details)                                                               // 4
var handle = LaunchScreen.hold();                                         // 5
                                                                          // 6
var Template = Package.templating && Package.templating.Template;         // 7
                                                                          // 8
Meteor.startup(function () {                                              // 9
  if (! Template) {                                                       // 10
    handle.release();                                                     // 11
  } else if (Package['iron:router']) {                                    // 12
    // XXX Instead of doing this here, this code should be in             // 13
    // iron:router directly. Note that since we're in a                   // 14
    // `Meteor.startup` block it's ok that we don't have a                // 15
    // weak dependency on iron:router in package.js.                      // 16
    Package['iron:router'].Router.onAfterAction(function () {             // 17
      handle.release();                                                   // 18
    });                                                                   // 19
  } else {                                                                // 20
    Template.body.onRendered(function () {                                // 21
      handle.release();                                                   // 22
    });                                                                   // 23
                                                                          // 24
    // In case `Template.body` never gets rendered (due to some bug),     // 25
    // hide the launch screen after 6 seconds. This matches the           // 26
    // observed timeout that Cordova apps on Android (but not iOS)        // 27
    // have on hiding the launch screen (even if you don't call           // 28
    // `navigator.splashscreen.hide()`)                                   // 29
    setTimeout(function () {                                              // 30
      handle.release();                                                   // 31
    }, 6000);                                                             // 32
  }                                                                       // 33
});                                                                       // 34
                                                                          // 35
////////////////////////////////////////////////////////////////////////////

}).call(this);


/* Exports */
if (typeof Package === 'undefined') Package = {};
Package['launch-screen'] = {
  LaunchScreen: LaunchScreen
};

})();
