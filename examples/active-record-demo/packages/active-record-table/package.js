Package.describe({
  name:'starrynight:active-record-table',
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

  api.addFiles('components/recordsTablePage/recordsTablePage.html', ['client']);
  api.addFiles('components/recordsTablePage/recordsTablePage.js', ['client']);
  api.addFiles('components/recordsTablePage/recordsTablePage.less', ['client']);

  api.export('recordsTablePage');
});

Package.onTest( function ( api ) {
  api.use('tinytest');
  api.use('starrynight:active-record-table');
  api.addFiles('active-record-table-tests.js');
});
