var fs = require('fs'),
    path = require('path'),
    rimraf = require('rimraf'),
    glob = require("glob"),
    Cucumber = require('cucumber/lib/cucumber'),
    CucumberSummaryFormatter = require('cucumber/lib/cucumber/listener/summary_formatter')({snippets: true}),
    tempTestFolder = path.resolve(process.cwd(), 'temp-tests'),
    runtime,
    cucumber = {
        features: {}
    };

function getFeatureSources() {
    var featureSources = [];

    glob.sync("tests/nightwatch/features/**/*.feature").forEach(function(file) {
        featureSources.push([path.resolve(process.cwd(), file), fs.readFileSync(file)]);
    });

    return featureSources;
}

function getSupportCodeInitializer() {
  return function() {
    var files = [],
      supportCodeHelper = this;

    glob.sync("tests/nightwatch/step-definitions/**/*.js").forEach(function(file) {
      files.push(path.resolve(process.cwd(), file));
    });

    files.forEach(function(file) {
      var initializer = require(file);

      if (typeof(initializer) === 'function'){
        initializer.call(supportCodeHelper);
      }
    });
  };
}

function getStepExecutor(step) {
    var stepDefinition = runtime.getSupportCodeLibrary().lookupStepDefinitionByName(step.getName());

    if (!stepDefinition) {
      CucumberSummaryFormatter.storeUndefinedStepResult(step);
      CucumberSummaryFormatter.log(Cucumber.Util.ConsoleColor.format('pending', 'Undefined steps found!\n'));
      return;
    }

    return function (context, callback) {
      stepDefinition.invoke(step, context, {getAttachments: function(){}}, {id:1}, callback);
    }
}

function discoverScenario(feature, scenario, steps) {
    if (!feature.discovered) {
      feature.discovered = {};
      cucumber.features[feature.getName()] = feature.discovered;
    }

    feature.discovered[scenario.getName()] = function(browser) {
      steps.forEach(function(step) {
        step(browser, function(result) {
          if (result.isFailed()) {
            console.log(result.getFailureException());
          }
        });
      });
      browser.end();
    };
}

function createTestFile(feature) {
  var testFileSource = 'module.exports = require(process.cwd() + "/globals/cucumber").features["' + feature.getName() + '"];';

  fs.writeFileSync(path.resolve(tempTestFolder, feature.getName().replace(/\W+/g, '') + '.js'), testFileSource);
}

rimraf.sync(tempTestFolder);
fs.mkdirSync(tempTestFolder);

runtime = Cucumber(getFeatureSources(), getSupportCodeInitializer());

runtime.getFeatures().getFeatures().forEach(function(feature, next) {
  createTestFile(feature);
  feature.instructVisitorToVisitScenarios({
    visitScenario: function(scenario) {
      var steps = [];
      scenario.getSteps().forEach(function(step, next) {
        var stepExecutor = getStepExecutor(step);

        if (stepExecutor) {
            steps.push(stepExecutor);
        }
        next();
      }, function() {
        discoverScenario(feature, scenario, steps);
      });
    }
  });
}, function() {});

if (CucumberSummaryFormatter.getUndefinedStepLogBuffer()) {
    CucumberSummaryFormatter.logUndefinedStepSnippets();
}

module.exports = cucumber;
