Package.describe({
  name: 'clinical:hipaa-routes',
  version: '0.1.0',
  // Brief, one-line summary of the package.
  summary: 'Helper package with routes for Hipaa Policy templates.',
  // URL to the Git repository containing the source code for this package.
  git: 'https://github.com/awatson1978/clinical-hipaa-routes',
  // By default, Meteor will default to using README.md for documentation.
  // To avoid submitting documentation, set this field to null.
  documentation: 'README.md'
});

Package.onUse(function(api) {
  api.versionsFrom('1.1.0.2');
  api.addFiles('hipaa-routes.js', 'client');

  api.use('meteor-platform');
  api.use('iron:router@1.0.7');
  api.use('less');
  api.use('clinical:hipaa-policies@0.0.2');

  api.imply('clinical:hipaa-policies');

  api.addFiles('components/hipaaPolicyMenu/hipaaPolicyMenu.html');
  api.addFiles('components/hipaaPolicyMenu/hipaaPolicyMenu.less');

  api.export('hipaaPolicyMenu');
});

Package.onTest(function(api) {
  api.use('tinytest');
  api.use('clinical:hipaa-routes');
  api.addFiles('hipaa-routes-tests.js');
});
