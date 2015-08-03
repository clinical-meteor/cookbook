Package.describe({
  name:'glass:active-record-edit',
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

  api.addFiles('components/recordEditPage/recordEditPage.html', ['client']);
  api.addFiles('components/recordEditPage/recordEditPage.js', ['client']);
  api.addFiles('components/recordEditPage/recordEditPage.less', ['client']);

  api.export('recordEditPage');
});

Package.onTest( function ( api ) {
  api.use('tinytest');
  api.use('glass:active-record-edit');
  api.addFiles('active-record-edit-tests.js');
});