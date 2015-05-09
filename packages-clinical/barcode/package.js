Package.describe({
  summary: 'Provides the 3 of 9 Barcode font.',
  version: '2.0.2',
  name: 'clinical:barcode',
  git: 'http://github.com/awatson1978/fonts-barcode.git'
});

Package.on_use(function (api) {
  api.addFiles('fonts/3OF9_NEW.TTF', 'client');
  api.addFiles('fonts-barcode.css', 'client');
});
