Package.describe({
  name: 'clinical:users-edit',
  version: '0.0.1',
  // Brief, one-line summary of the package.
  summary: '',
  // URL to the Git repository containing the source code for this package.
  git: '',
  // By default, Meteor will default to using README.md for documentation.
  // To avoid submitting documentation, set this field to null.
  documentation: 'README.md'
});

Package.onUse( function (api) {
  api.versionsFrom('1.1.0.2');

  api.use('meteor-platform');
  api.use('iron:router');
  api.use('less');

  api.addFiles('components/userEditPage/userEditPage.html', ['client']);
  api.addFiles('components/userEditPage/userEditPage.js', ['client']);
  api.addFiles('components/userEditPage/userEditPage.less', ['client']);

  api.export('userEditPage');
});

Package.onTest( function (api) {
  api.use('tinytest');
  api.use('clinical:users-edit');
  api.addFiles('users-edit-tests.js');
});
