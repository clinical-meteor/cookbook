Package.describe({
  name:'starrynight:active-record-list',
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

  api.use('starrynight:active-record-header');
  api.use('starrynight:active-record-footer');

  api.addFiles('components/recordsListPage/recordsListPage.html', ['client']);
  api.addFiles('components/recordsListPage/recordsListPage.js', ['client']);
  api.addFiles('components/recordsListPage/recordsListPage.less', ['client']);

  api.export('recordsListPage');
});

Package.onTest( function ( api ) {
  api.use('tinytest');
  api.use('starrynight:active-record-list');
  api.addFiles('active-record-list-tests.js');
});
