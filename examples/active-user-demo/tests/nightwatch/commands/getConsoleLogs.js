exports.command = function() {
  this.getLog('browser', function(logEntriesArray) {
    console.log('Log length: ' + logEntriesArray.length);
    logEntriesArray.forEach(function(log) {
       console.log('[' + log.level + '] ' + log.timestamp + ' : ' + log.message);
     });
  });
};
