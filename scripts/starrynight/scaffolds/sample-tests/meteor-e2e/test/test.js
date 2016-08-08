describe('Google', function () {

  it('should have the correct title', function () {
    browser.get('http://www.google.com');
    expect(browser.title()).to.contain('Google');
  });

});