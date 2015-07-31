Package.describe({
  name:'clinical:active-form-upsert',
  version: '0.0.1',
  sumary: '',
  git: '',
  documentation: 'README.md',
});

Package.onUse( function ( api ) {
  api.versionsFrom('1.1.0.2');
  api.use('aldeed:simple-schema@1.3.3');
  api.use('aldeed:collection2@2.3.3');
  api.use('aldeed:autoform@5.3.2');

  api.use('meteor-platform');
  api.use('iron:router');
  api.use('less');

  api.addFiles('components/userUpsertPage/userUpsertPage.html', ['client']);
  api.addFiles('components/userUpsertPage/userUpsertPage.js', ['client']);
  api.addFiles('components/userUpsertPage/userUpsertPage.less', ['client']);

  api.export('userUpsertPage');
});

Package.onTest( function ( api ) {
  api.use('tinytest');
  api.use('clinical:users-upsert');
  api.addFiles('users-upsert-tests.js');
});
