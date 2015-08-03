Package.describe({
  name:'glass:active-record-footer',
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

  api.addFiles('components/recordFooter/recordFooter.html', ['client']);
  api.addFiles('components/recordFooter/recordFooter.js', ['client']);
  api.addFiles('components/recordFooter/recordFooter.less', ['client']);

  api.export('recordFooter');
});

Package.onTest( function ( api ) {
  api.use('tinytest');
  api.use('glass:active-record-footer');
  api.addFiles('active-record-footer-tests.js');
});