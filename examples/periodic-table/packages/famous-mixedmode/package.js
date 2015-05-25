var path = Npm.require('path');
var fs = Npm.require('fs');

Package.describe({
	summary: 'Famo.us mixed mode integration in meteor',
	name: 'famous',
	version: '1.0.0',
	git: 'https://github.com/me/famous.git'
});

Package.onUse(function (api) {

  api.add_files('src/famous.css', 'client');
    api.add_files('src/bundle.js','client');
	api.add_files('src/export.js', 'client');

	api.export('famous');
});

Package.onTest(function (api) {
	api.use('famous');
	api.use('tinytest');
});
