describe('Password based login', function () {

  // these steps are sequential and stateful in nature, so stop
  // after first failures.
  this.bail(true);

  // use a browser-specific email here to ensure each browser creates
  // a different test account. this is retrieved during the test and
  // reused in multiple specs.
  var browserTestAccount;

  before(function () {
    browser.get('http://rainforest-auth-qa.meteor.com');
    browser.wait('#login-sign-in-link', 30000);
    // cache browser test account
    browserTestAccount = browser.find('#browser-email').text();
    // delete the browser-specific test account, if it exists
    browser.find('#remove-test-account').click();
    browser.wait('#server-action-ok', 30000);
  });

  it('should display correct UI elements', function () {
    
    browser.find('#login-sign-in-link', 30000).click();
    browser.wait([
      '#login-email-label',
      '#login-email',
      '#login-password-label',
      '#login-password',
      '#login-buttons-password',
      '#signup-link',
      '#forgot-password-link'
    ]);
  });

  it('should show correct error message for invalid email', function () {
    browser.find('#login-buttons-password').click();
    expect(browser.find('.message.error-message').text()).to.contain('Invalid email');
  });

  it('should show correct error message when user is not found', function () {
    browser.find('#login-email').type('foo@bar.com');
    browser.find('#login-password').type('12345');
    browser.find('#login-buttons-password').click();
    expect(browser.find('.message.error-message', 30000).text()).to.contain('User not found');
  });

  it('should require at least 6 characters for password', function () {
    browser.find('#signup-link').click();
    browser.find('#login-email').clear().type(browserTestAccount);
    browser.find('#login-buttons-password').click();
    expect(browser.find('.message.error-message').text())
      .to.contain('Password must be at least 6 characters long');
  });

  it('should sign in after successfully creating a new account', function () {
    browser.find('#login-password').clear().type('123456');
    browser.find('#login-buttons-password').click();
    expect(browser.find('#login-name-link', 30000).text()).to.contain(browserTestAccount);
  });

  it('should be able to sign out', function () {
    browser.find('#login-name-link').click();
    browser.find('#login-buttons-logout').click();
    expect(browser.find('#login-sign-in-link', 30000).text()).to.contain('Sign in ▾');
  });

  it('should show correct error message for incorrect password', function () {
    browser.find('#login-sign-in-link').click();
    browser.find('#login-email').type(browserTestAccount);
    browser.find('#login-password').type('654321');
    browser.find('#login-buttons-password').click();
    expect(browser.find('.message.error-message', 30000).text()).to.contain('Incorrect password');
  });

  it('should be able to sign in after signing out', function () {
    browser.find('#login-password').clear().type('123456');
    browser.find('#login-buttons-password').click();
    expect(browser.find('#login-name-link', 30000).text()).to.contain(browserTestAccount);
  });

  it('should be able to change password', function () {
    browser.find('#login-name-link').click();
    browser.find('#login-buttons-open-change-password').click();
    browser.find('#login-old-password').type('123456');
    browser.find('#login-password').type('654321');
    browser.find('#login-buttons-do-change-password').click();
    expect(browser.find('.message.info-message', 30000).text()).to.contain('Password changed');
  });

  it('should be able to sign with changed password', function () {
    //sign out
    browser.find('.login-close-text').click();
    browser.find('#login-name-link').click();
    browser.find('#login-buttons-logout').click();
    expect(browser.find('#login-sign-in-link', 30000).text()).to.contain('Sign in ▾');
    // sign in again
    browser.find('#login-sign-in-link').click();
    browser.find('#login-email').type(browserTestAccount);
    browser.find('#login-password').type('654321');
    browser.find('#login-buttons-password').click();
    expect(browser.find('#login-name-link', 30000).text()).to.contain(browserTestAccount);
  });

  it('should show correct error message when creating an account that already exists', function () {
    //sign out
    browser.find('#login-name-link').click();
    browser.find('#login-buttons-logout').click();
    expect(browser.find('#login-sign-in-link', 30000).text()).to.contain('Sign in ▾');
    // try to create existing account
    browser.find('#login-sign-in-link').click();
    browser.find('#signup-link').click();
    browser.find('#login-email').type(browserTestAccount);
    browser.find('#login-password').type('123456');
    browser.find('#login-buttons-password').click();
    expect(browser.find('.message.error-message', 30000).text())
      .to.contain('Email already exists');
  });

  it('should show correct custom error message thrown in validateNewUser()', function () {
    browser.find('#login-email').clear().type('invalid@qa.com');
    browser.find('#login-buttons-password').click();
    expect(browser.find('.message.error-message', 30000).text())
      .to.contain('Invalid email address');
  });

});
