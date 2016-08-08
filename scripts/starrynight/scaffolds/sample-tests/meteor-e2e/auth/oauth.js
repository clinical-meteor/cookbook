var excludedPairs = [
  ['safari', 'github'],
  ['safari', 'meteor-developer'],
  ['ie8', 'meteor-developer'],
  ['ie9', 'meteor-developer']
];

var providersToRun = function () {
  //var _ = require('underscore');
  var allProviders = require('./oauth_providers').filter(function (provider) {
    return ! excludedPairs.some(function (pair) {
      return pair[0] === browser.name && pair[1] === provider.name;
    });
  });

  if (process.env.TEST_OAUTH_PROVIDERS) {
    var providerList = process.env.TEST_OAUTH_PROVIDERS.split(',');
    return allProviders.filter(function (provider) {
      //return _.contains(providerList, provider.name);
      if(providerList.indexOf(provider.name) > -1){
        return true;
      }else{
        return false;
      }
    });
  } else {
    return allProviders;
  }
};

describe('A small app with accounts', function () {

  var openDropdown = function () {
    browser.find("#login-sign-in-link, #login-name-link").click();
  };
  var closeDropdown = function () {
    browser.find("a.login-close-text").click();
  };

  var startSignIn = function (providerName) {
    browser.find('#login-buttons-' + providerName).click();
  };

  var expectSignedIn = function (userDisplayName) {
    expect(browser.find('#login-name-link', 30000).text()).to.contain(userDisplayName);
  };

  var signOut = function () {
    browser.find('#login-buttons-logout').click();
    expect(browser.find("#login-sign-in-link", 30000).text()).to.contain("Sign in ▾");
  };

  before(function () {
    browser.get('http://rainforest-auth-qa.meteor.com');
  });

  providersToRun().forEach(function (provider) {
    describe("- " + provider.name + ' login', function () {
      // these steps are sequential and stateful in nature, so stop
      // after first failures.
      this.bail(true);

      before(function () {
        browser.focusMainWindow();
        browser.refresh();
      });

      it('open login popup', function () {

        browser.wait('#login-sign-in-link', 30000);

        openDropdown();
        expect(browser.find("#login-buttons-" + provider.name).text()).to.contain("Sign in with");
        startSignIn(provider.name);

      });

      it('popup loads', function () {
        // Should show a popup. Test that when we close the pop-up we
        // don't lose the ability to then log in again afterwards.
        browser.focusSecondWindow();
        provider.waitForPopupContents();
        browser.close();
        browser.focusMainWindow();
      });

      it('open login popup again', function () {
        startSignIn(provider.name);
        browser.focusSecondWindow();
        provider.waitForPopupContents();
      });

      it('sign in popup', function () {
        provider.signInInPopup();
        browser.focusMainWindow();
      });

      it('signs in in app', function () {
        expectSignedIn(provider.userDisplayName);
      });

      it('signs out', function () {
        openDropdown();
        signOut();
      });

      it('open login popup after having previously logged in', function () {
        openDropdown();
        startSignIn(provider.name);
      });

      if (provider.signInInSecondPopup) {
        it('sign in popup after having previously logged in', function () {
          browser.focusSecondWindow();
          provider.signInInSecondPopup();
          browser.focusMainWindow();
        });
      };

      it('signs in in app', function () {
        expectSignedIn(provider.userDisplayName);
      });

      it('signs out a second time', function () {
        openDropdown();
        signOut(provider.name);
      });

    });
  });
});
