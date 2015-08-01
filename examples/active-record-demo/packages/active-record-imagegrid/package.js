Package.describe({
  name:'starrynight:active-record-imagegrid',
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

  api.addFiles('components/recordImageGridPage/recordImageGridPage.html', ['client']);
  api.addFiles('components/recordImageGridPage/recordImageGridPage.js', ['client']);
  api.addFiles('components/recordImageGridPage/recordImageGridPage.less', ['client']);

  api.export('recordImageGridPage');
});

Package.onTest( function ( api ) {
  api.use('tinytest');
  api.use('starrynight:active-record-imagegrid');
  api.addFiles('active-record-imagegrid-tests.js');
});
