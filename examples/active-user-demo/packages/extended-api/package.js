Package.describe({
  summary: "Extended API for Session and Collection.",

  // update this value before you run 'meteor publish'
  version: "1.0.1",

  // if this value isn't set, meteor will default to the directory name
  name: "clinical:extended-api",

  // and add this value if you want people to access your code from Atmosphere
  git: "http://github.com/awatson1978/clinical-extended-api.git"
});

Package.on_use(function (api) {
  api.use('meteor-platform@1.1.6');

  // Session can work with or without reload, but if reload is present
  // it should load first so we can detect it at startup and populate
  // the session.
  api.use('reload@1.1.3', 'client', {weak: true});

  api.use('session@1.1.0', 'client');
  api.use('underscore@1.0.3', 'client');
  api.use('reactive-dict@1.1.0', 'client');
  api.use('ejson@1.0.6', 'client');

  api.export('Session', 'client');
  api.export('Collection');
  api.add_files('lib/session-extended-api.js', 'client');
  api.add_files('lib/collection-extended-api.js', 'server');
});



Package.on_test(function (api) {
  api.use('tinytest');
  //api.use(['session', 'underscore', 'reactive-dict', 'ejson'], 'client');

  api.use('meteor-platform');

  api.use('session', 'client');
  api.use('deps');
  api.use('mongo');
  api.use('mongo-livedata');
  api.use('clinical:extended-api');

  api.add_files('tests/session-extended-api-tests.js', 'client');
  api.add_files('tests/collection-extended-api-tests.js');
});
