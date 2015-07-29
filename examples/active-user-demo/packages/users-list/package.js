Package.describe({
  name:'clinical:users-list',
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

  api.addFiles('components/usersListPage/usersListPage.html', ['client']);
  api.addFiles('components/usersListPage/usersListPage.js', ['client']);
  api.addFiles('components/usersListPage/usersListPage.less', ['client']);

  api.export('usersListPage');
});

Package.onTest( function ( api ) {
  api.use('tinytest');
  api.use('clinical:users-list');
  api.addFiles('users-list-tests.js');
});