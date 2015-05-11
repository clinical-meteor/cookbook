Package.describe({
  name: 'foo:foo-edit-page',
  version: '0.0.1',
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
  api.addFiles('fooEditPage.html', ['client']);
  api.addFiles('fooEditPage.js' ['client']);
  api.addFiles('fooEditPage.less', ['client']);

  api.use('meteor-platform');
  api.use([
    'templating',
    'grove:less',
  ], ['client']);
  api.use('iron:router@1.0.4')
});

Package.onTest(function(api) {
  api.use('tinytest');

  api.use('meteor-platform');
  api.use([
    'templating',
    'grove:less',
  ], ['client']);
  api.use('iron:router@1.0.4');

  api.use('foo:foo-edit-page');
  api.addFiles('foo-edit-page-tests.js');
});
