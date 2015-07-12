Package.describe({
  name: 'clinical:entry',
  version: '0.0.2',
  // Brief, one-line summary of the package.
  summary: 'Entry pages and emails, for ClinicalFramework.',
  // URL to the Git repository containing the source code for this package.
  git: 'https://github.com/awatson1978/clinical-entry',
  // By default, Meteor will default to using README.md for documentation.
  // To avoid submitting documentation, set this field to null.
  documentation: 'README.md'
});

Package.onUse(function(api) {
  api.versionsFrom('1.1.0.2');

  api.use('clinical:entry-pages@0.1.1');

  api.addFiles('entry.js');
});

Package.onTest(function(api) {
  api.use('tinytest');
  api.use('clinical:entry');
  api.addFiles('entry-tests.js');
});
