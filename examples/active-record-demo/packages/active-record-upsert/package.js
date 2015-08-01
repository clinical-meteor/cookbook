Package.describe({
  name:'starrynight:active-record-upsert',
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

  api.addFiles('components/recordUpsertPage/recordUpsertPage.html', ['client']);
  api.addFiles('components/recordUpsertPage/recordUpsertPage.js', ['client']);
  api.addFiles('components/recordUpsertPage/recordUpsertPage.less', ['client']);

  api.export('recordUpsertPage');
});

Package.onTest( function ( api ) {
  api.use('tinytest');
  api.use('starrynight:active-record-upsert');
  api.addFiles('active-record-upsert-tests.js');
});