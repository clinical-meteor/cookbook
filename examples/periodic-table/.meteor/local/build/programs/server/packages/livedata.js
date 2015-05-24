(function () {

/* Imports */
var Meteor = Package.meteor.Meteor;
var DDP = Package.ddp.DDP;
var DDPServer = Package.ddp.DDPServer;

/* Package-scope variables */
var DDP, DDPServer, LivedataTest;



/* Exports */
if (typeof Package === 'undefined') Package = {};
Package.livedata = {
  DDP: DDP,
  DDPServer: DDPServer,
  LivedataTest: LivedataTest
};

})();

//# sourceMappingURL=livedata.js.map
