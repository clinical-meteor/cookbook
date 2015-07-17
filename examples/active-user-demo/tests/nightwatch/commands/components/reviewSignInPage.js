exports.command = function(username, password) {
  this
    .waitForElementVisible('#entrySignIn', 1000)
      .expect.element("#signInPageTitle").to.be.visible
      .expect.element("#signInPageMessage").to.be.visible

      .expect.element("#signUpPageEmailInput").to.be.visible
      .expect.element("#signUpPagePasswordInput").to.be.visible
      .expect.element("#signUpPagePasswordInput").to.be.visible
      .expect.element("#signUpPageJoinNowButton").to.be.visible

      .expect.element("#signInToAppButton").to.be.visible
      .expect.element("#needAnAccountButton").to.be.visible

      .expect.element("#needAnAccountButton").text.to.equal("Sign In")
      .expect.element("#signInPageMessage").text.to.equal("Improve your clincal practice with checklists.")

      /*.verify.elementPresent("#signInPageTitle")
      .verify.elementPresent("#signInPageMessage")
      .verify.elementPresent("#signInPageEmailInput")
      .verify.elementPresent("#signInPagePasswordInput")
      .verify.elementPresent("#signInToAppButton")
      .verify.elementPresent("#needAnAccountButton")*/

      /*.verify.containsText("#signInPageTitle", "Sign In")
      .verify.containsText("#signInPageMessage", "Improve your clincal practice with checklists.")*/

  return this; // allows the command to be chained.
};
