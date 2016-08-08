var browserTestAccount;
// var testURL = 'localhost:3000';
var testURL = 'rainforest-auth-qa.meteor.com';
var emailLinkRegex = new RegExp('http:\\/\\/' + testURL + '\\/#\\/[a-zA-z-_\\d\\/]+');

// assert content on the first email in the list
var assertEmail = function (options) {
  for (var key in options) {
    expect(browser.find('.email-log:first-child .email-' + key, 30000).text())
      .to.contain(options[key]);
  }
};

// open a new window, and login with a different test account
var openNewWindowAndLogin = function () {
  browser.newWindow('http://' + testURL);
  browser.focusSecondWindow();
  // IE opens a tiny new window which makes screenshots too small
  browser.setWindowSize(800, 600);
  browser.find('#login-sign-in-link', 30000).click();
  browser.find('#login-email').type('email@qa.com');
  browser.find('#login-password').type('123456');
  browser.find('#login-buttons-password').click();
  expect(browser.find('#login-name-link', 30000).text())
    .to.contain('email@qa.com');
};

// go to the linked found in the top-most email
var goToLinkInEmail = function () {
  var text = browser.find('.email-log:first-child .email-text').text();
  var match = text.match(emailLinkRegex);
  expect(match).to.exist;
  browser.get(match[0]);
  browser.refresh(); // force reload because it's a hash link
};

var assertSignedIn = function () {
  expect(browser.find('#login-name-link', 30000).text())
    .to.contain(browserTestAccount);
};

var signOut = function () {
  browser.find('#login-name-link', 30000).click();
  browser.find('#login-buttons-logout').click();
};

var assertSignedOut = function () {
  expect(browser.find('#login-sign-in-link', 30000).text())
    .to.contain('Sign in ▾');
};

var closeSecondWindow = function () {
  browser.focusSecondWindow();
  browser.close();
  browser.focusMainWindow();
};

describe('Auth Email -', function () {

  before(function () {
    browser.get('http://' + testURL);
    browser.wait('#email-logs', 30000);
    // cache browser test account
    browserTestAccount = browser.find('#browser-email').text();
    // clear email logs before we start the test
    browser.find('#clear-email-logs').click();
    browser.wait('#server-action-ok', 30000);
    expect(browser.count('.email-log')).to.equal(0);
  });

  describe('Forgot Password', function () {

    // these steps are sequential and stateful in nature, so stop
    // after first failures.
    this.bail(true);

    it('should send correct email', function () {
      browser.find('#create-test-account').click();
      browser.wait('#server-action-ok', 30000);
      browser.find('#login-sign-in-link').click();
      browser.find('#forgot-password-link').click();
      browser.find('#forgot-password-email').type(browserTestAccount);
      browser.find('#login-buttons-forgot-password').click();
      expect(browser.find('.message.info-message', 3000).text())
        .to.contain('Email sent');
      assertEmail({
        from: 'Meteor Accounts <no-reply@meteor.com>',
        to: browserTestAccount,
        subject: 'How to reset your password on ' + testURL,
        text: 'Hello, To reset your password, simply click the link below. ' +
          'http://' + testURL + '/#/reset-password/'
      });
    });

    it('should not be logged in when following the email link', function () {
      openNewWindowAndLogin();
      browser.focusMainWindow();
      goToLinkInEmail();
      assertSignedOut();
    });

    it('should log in after resetting the password', function () {
      browser.find('#reset-password-new-password').type('654321');
      browser.find('#login-buttons-reset-password-button').click();
      // expect logged in
      assertSignedIn();
      expect(browser.find('.accounts-dialog').text())
        .to.contain('Password reset. You are now logged in as ' + browserTestAccount);
      browser.find('#just-verified-dismiss-button').click();
    });

    it('should transfer the login to another tab', function () {
      browser.focusSecondWindow();
      browser.wait('#login-name-link', 30000, function (el) {
        return el.text().indexOf(browserTestAccount) > -1;
      });
    });

    it('sign out should affect both tabs', function () {
      signOut();
      assertSignedOut();
      browser.focusMainWindow();
      assertSignedOut();
    });

    it('should not be able to login with old password', function () {
      browser.find('#login-sign-in-link').click();
      browser.find('#login-email').type(browserTestAccount);
      browser.find('#login-password').type('123456');
      browser.find('#login-buttons-password').click();
      expect(browser.find('.message.error-message', 30000).text())
        .to.contain('Incorrect password');
    });

    it('should be able to login with changed password', function () {
      browser.find('#login-password').clear().type('654321');
      browser.find('#login-buttons-password').click();
      assertSignedIn();
    });

    it('should not be able to use the same reset link again', function () {
      goToLinkInEmail();
      browser.find('#reset-password-new-password', 30000).type('123456');
      browser.find('#login-buttons-reset-password-button').click();
      expect(browser.find('.accounts-dialog .error-message', 30000).text())
        .to.contain('Token expired');
    });

    after(function () {
      closeSecondWindow();
    });

  });

  describe('Verification Email', function () {

    // these steps are sequential and stateful in nature, so stop
    // after first failures.
    this.bail(true);

    before(function () {
      browser.refresh();
      browser.find('#remove-test-account').click();
      browser.wait('#server-action-ok', 30000);
      assertSignedOut(); // delete account should sign out
    });

    it('should send correct email when creating account', function () {
      browser.find('#login-sign-in-link').click();
      browser.find('#signup-link').click();
      browser.find('#login-email').type(browserTestAccount);
      browser.find('#login-password').type('123456');
      browser.find('#login-buttons-password').click();
      assertSignedIn();
      assertEmail({
        from: 'Meteor Accounts <no-reply@meteor.com>',
        to: browserTestAccount,
        subject: 'How to verify email address on ' + testURL,
        text: 'Hello, To verify your account email, simply click the link below. ' +
          'http://' + testURL + '/#/verify-email/'
      });
      signOut();
      assertSignedOut();
    });

    it('should be logged in when following the email link', function () {
      openNewWindowAndLogin();
      browser.focusMainWindow();
      goToLinkInEmail();
      // expect signed in
      assertSignedIn();
      expect(browser.find('.accounts-dialog', 30000).text())
        .to.contain('Email verified. You are now logged in as ' + browserTestAccount);
      browser.find('#just-verified-dismiss-button').click();
    });

    it('should transfer the login to another tab', function () {
      browser.focusSecondWindow();
      browser.wait('#login-name-link', 30000, function (el) {
        return el.text().indexOf(browserTestAccount) > -1;
      });
    });

    it('sign out should affect both tabs', function () {
      signOut();
      assertSignedOut();
      browser.focusMainWindow();
      assertSignedOut();
    });

    after(function () {
      closeSecondWindow();
    });

  });

  describe('Accounts.sendEnrollmentEmail', function () {

    // these steps are sequential and stateful in nature, so stop
    // after first failures.
    this.bail(true);

    before(function () {
      browser.refresh();
    });

    it('should send correct email', function () {
      browser.find('#test-send-enrollment-email').click();
      browser.wait('#server-action-ok', 30000);
      assertEmail({
        from: 'Meteor Accounts <no-reply@meteor.com>',
        to: browserTestAccount,
        subject: 'An account has been created for you on ' + testURL,
        text: 'Hello, To start using the service, simply click the link below. ' +
          'http://' + testURL + '/#/enroll-account/'
      });
    });

    it('should not be logged in when following the email link', function () {
      openNewWindowAndLogin();
      browser.focusMainWindow();
      goToLinkInEmail();
      assertSignedOut();
    });

    it('should be able to log in after setting password', function () {
      browser.find('#enroll-account-password').type('123456');
      browser.find('#login-buttons-enroll-account-button').click();
      // expect logged in
      assertSignedIn();
    });

    it('should transfer the login to another tab', function () {
      browser.focusSecondWindow();
      browser.wait('#login-name-link', 30000, function (el) {
        return el.text().indexOf(browserTestAccount) > -1;
      });
    });

    it('sign out should affect both tabs', function () {
      signOut();
      assertSignedOut();
      browser.focusMainWindow();
      assertSignedOut();
    });

    it('should be able to login with new password', function () {
      browser.find('#login-sign-in-link').click();
      browser.find('#login-email').type(browserTestAccount);
      browser.find('#login-password').type('123456');
      browser.find('#login-buttons-password').click();
      assertSignedIn();
    });

    after(function () {
      closeSecondWindow();
      signOut();
    });

  });

});
