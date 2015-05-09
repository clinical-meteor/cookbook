Package.describe({
  name: 'clinical:static-pages',
  summary: 'Add glossary, about, eula, and privacy pages to your ClinicalFramework app.',
  version: '1.0.5',
  git: 'http://github.com/awatson1978/clinical-static-pages.git'
});

Package.onUse(function(api) {
  api.versionsFrom('1.0');
  api.use('less', 'client');
  api.use('templating', 'client');

  api.addFiles('components/aboutPage/aboutPage.html');
  api.addFiles('components/aboutPage/aboutPage.js');
  api.addFiles('components/aboutPage/aboutPage.less');

  api.addFiles('components/eulaPage/eulaPage.html');
  api.addFiles('components/eulaPage/eulaPage.js');
  api.addFiles('components/eulaPage/eulaPage.less');

  api.addFiles('components/privacyPage/privacyPage.less');
  api.addFiles('components/privacyPage/privacyPage.js');
  api.addFiles('components/privacyPage/privacyPage.html');

  api.addFiles('components/supportPage/supportPage.less');
  api.addFiles('components/supportPage/supportPage.js');
  api.addFiles('components/supportPage/supportPage.html');
});


Package.onTest(function(api) {
  api.use('tinytest');
  //api.use('less');
  //api.use('templating');

  api.addFiles('tiny/clinical-static-pages-tests.js');
});
