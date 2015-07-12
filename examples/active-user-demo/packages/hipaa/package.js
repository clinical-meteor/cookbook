Package.describe({
  name: 'clinical:hipaa',
  version: '0.0.2',
  // Brief, one-line summary of the package.
  summary: 'HIPAA Compliance for Meteor Apps.  Meta package containing audit log, user accounts, and ssl security.',
  // URL to the Git repository containing the source code for this package.
  git: 'https://github.com/awatson1978/clinical-hipaa',
  // By default, Meteor will default to using README.md for documentation.
  // To avoid submitting documentation, set this field to null.
  documentation: 'README.md'
});

Package.onUse(function(api) {
  api.versionsFrom('1.1.0.2');

  api.use('accounts-base');
  api.use('accounts-password');
  api.use('force-ssl');
  api.use('clinical:hipaa-audit-log@1.2.3');

  api.addFiles('hipaa.js');
});

Package.onTest(function(api) {
  api.use('tinytest');
  api.use('clinical:hipaa');
  api.addFiles('hipaa-tests.js');
});
