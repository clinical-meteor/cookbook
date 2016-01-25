Package.describe({
  name: 'clinical:offline',
  version: '0.0.1',
  summary: 'Offline data persistence for Clinical Meteor apps.',
  git: 'https://github.com/clinical-meteor/clinical-offline',
  documentation: 'README.md'
});

Package.onUse(function(api) {
  api.versionsFrom('1.1.0.3');

  api.use('ground:db@0.3.12');
  api.addFiles('offline.js');
});

Package.onTest(function(api) {
  api.use('tinytest');
  api.use('clinical:offline');
  api.addFiles('tests/gagarin/offline.js');
});
