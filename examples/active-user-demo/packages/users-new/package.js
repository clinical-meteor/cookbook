Package.describe({
  name:'clinical:users-new',
  version: '0.0.1',
  sumary: '',
  git: '',
  documentation: 'README.md',
});

Package.onUse( function ( api ) {
  api.versionsFrom('1.1.0.2');
  api.use('meteor-platform');
  api.use('iron:router');
  api.use('less');

  api.addFiles('components/userNewPage/userNewPage.html', ['client']);
  api.addFiles('components/userNewPage/userNewPage.js', ['client']);
  api.addFiles('components/userNewPage/userNewPage.less', ['client']);

  api.export('userNewPage');
});

Package.onTest( function ( api ) {
  api.use('tinytest');
  api.use('clinical:users-new');
  api.addFiles('users-new-tests.js');
});
