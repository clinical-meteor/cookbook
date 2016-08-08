// all accounts have the same email and password
var email = "meteorauthqa@gmail.com";

if (!process.env.OAUTH_PROVIDERS_PASSWORD) {
  console.error("Need to set OAUTH_PROVIDERS_PASSWORD environment variable");
  process.exit(1);
}
var password = process.env.OAUTH_PROVIDERS_PASSWORD;

module.exports = [
  {
    name: 'github',
    userDisplayName: 'Meteor AuthQA',
    waitForPopupContents: function () {
      expect(browser.find('#login', 30000).text()).to.contain("Sign in");
    },
    signInInPopup: function () {
      browser.find('#login_field').type(email);
      browser.find('#password').type(password);
      browser.find('input[name=commit]').click();
    }
  },
  {
    name: 'google',
    userDisplayName: 'Auth Meteor',
    waitForPopupContents: function () {
      expect(browser.find('h2', 30000).text()).to.contain("Sign in with your Google Account");
    },
    signInInPopup: function () {
      browser.find('#Email').type(email);
      browser.find('#Passwd').type(password);
      browser.find('input[name=signIn]').click();
    }
  },
  {
    name: 'facebook',
    userDisplayName: 'Auth Meteor',
    waitForPopupContents: function () {
      expect(browser.find('#login_form', 30000).text()).to.contain("Meteor Auth QA");
    },
    signInInPopup: function () {
      browser.find('#email').type(email);
      browser.find('#pass').type(password);
      browser.find('input[name=login]').click();
    }
  },
  {
    name: 'twitter',
    userDisplayName: 'Auth Meteor',
    waitForPopupContents: function () {
      if (browser.name === "safari") {
        // For some reason, on Twitter login under Safari-on-Selenium,
        // trying to run any action immediately after focusing the
        // popup window leads to Selenium hanging. All webdriver
        // operations seem to exhibit the same behavior. So
        // unfortunately, we use a long timeout to wait for the popup
        // to "stabilize" enough for Selenium operations to not hang.
        browser.sleep(10000);
      }
      expect(browser.find('div.auth h2', 30000).text()).to.contain("Authorize Meteor Auth QA");
    },
    signInInPopup: function () {
      browser.find('#username_or_email').type(email);
      browser.find('#password').type(password);
      browser.find('#allow').click();
      // Mysteriously, on some browsers, Twitter requires also
      // clicking on "Authorize App" on every sign in.
      //
      // Hack: poll every sec to see if the popup is still open.
      // if it's closed, it means we've successfully signed in; otherwise,
      // check the #allow button's value (it's an <input> tag, for whatever
      // reason!) - if it's "Authorize app" then we click it again, otherwise
      // keep polling until popup closes. 
      while (true) {
        browser.sleep(1000);
        var windowCount = browser.windowHandles().length;
        if (windowCount > 1) {
          // popup still open
          var button
          var buttonText
          try {
            button = browser.find('#allow');
            buttonText = button.getValue();
          } catch (e) {
            // if we get an error here, it's a stale element
            // reference, so the popup was closed when we were getting
            // the button text; we're done.
            break;
          }
          // second click is required.
          if (buttonText === 'Authorize app') {
            button.click();
            break;
          }
        } else {
          break;
        }
      }
    }
  },
  {
    name: 'meteor-developer',
    userDisplayName: 'meteorauthqa',
    waitForPopupContents: function () {
      expect(browser.find('div.header', 30000).text()).to.contain("Meteor Auth QA");
    },
    signInInPopup: function () {
      browser.find('input[name=usernameOrEmail]').type(email);
      browser.find('input[name=password]').type(password);
      browser.find('input[type=submit]').click();
    },
    signInInSecondPopup: function () {
      browser.find('a.login-with-account').click(); // "Use this account"
    }
  },
  {
    name: 'meetup',
    userDisplayName: 'Auth Meteor',
    waitForPopupContents: function () {
      if (browser.name === "safari") {
        // For some reason, on Meetup login under Safari-on-Selenium,
        // trying to run any action immediately after focusing the
        // popup window leads to Selenium hanging. All webdriver
        // operations seem to exhibit the same behavior. So
        // unfortunately, we use a long timeout to wait for the popup
        // to "stabilize" enough for Selenium operations to not hang.
        browser.sleep(10000);
      }
      expect(browser.find('#paneLogin', 30000).text()).to.contain("Meteor Auth QA");
    },
    signInInPopup: function () {
      browser.find('#email').type(email);
      browser.find('#password').type(password);
      browser.find('input[type=submit]').click();
    }
  }

  // Weibo is excluded from the tests because it requires Captcha in an
  // unpredictable fashion.

  // , {
  //   name: 'weibo',
  //   userDisplayName: 'AuthMeteor',
  //   waitForPopupContents: function () {
  //     expect(browser.find('p.oauth_main_info', 30000).text()).to.contain("meteor_auth_qa");
  //   },
  //   signInInPopup: function () {
  //     browser.find('#userId').type(email);
  //     browser.find('#passwd').type(password);
  //     browser.find('a[action-type=submit]').click();
  //   }
  // }
];
