Package.describe({
  name: 'clinical:dataset-plants',
  version: '0.0.2',
  // Brief, one-line summary of the package.
  summary: '',
  // URL to the Git repository containing the source code for this package.
  git: '',
  // By default, Meteor will default to using README.md for documentation.
  // To avoid submitting documentation, set this field to null.
  documentation: 'README.md'
});

Package.onUse(function(api) {
  api.versionsFrom('1.1.0.2');
  api.addFiles('dataset-plants.js', "server");
});

Package.onTest(function(api) {
  api.use('tinytest');
  api.use('clinical:dataset-plants');
  api.addFiles('dataset-plants-tests.js');
});
