Package.describe({
  name:'starrynight:active-record-header',
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

  api.addFiles('components/recordHeader/recordHeader.html', ['client']);
  api.addFiles('components/recordHeader/recordHeader.js', ['client']);
  api.addFiles('components/recordHeader/recordHeader.less', ['client']);

  api.export('recordHeader');
});

Package.onTest( function ( api ) {
  api.use('tinytest');
  api.use('starrynight:active-record-header');
  api.addFiles('active-record-header-tests.js');
});