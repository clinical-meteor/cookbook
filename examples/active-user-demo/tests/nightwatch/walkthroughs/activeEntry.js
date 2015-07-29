// // add tests to this file using the Nightwatch.js API
// // http://nightwatchjs.org/api
//
//
//
// module.exports = {
//   tags: ['users', 'entry'],
//   before: function(client){
//     // this depends on the accounts-housemd package
//     client
//       .url("http://localhost:3000")
//       .meteorCall("removeAllUsers", false, false)
//       .pause(500)
//   },
//   "new user should be able to register on desktop" : function (client) {
//     var newUserId = false;
//     client
//       .resizeWindow(1024, 768)
//       .url("http://localhost:3000/entrySignUp")
//       .reviewSignInPage()
//   },
//   "company logo should display on sign-in page" : function (client) {
//     client
//       .expect.element("#logo").to.be.visible
//   },
//   "error messages should be empty by default" : function (client) {
//     client
//       .expect.element("#errorMessages").to.not.be.visible
//   },
//   "user should be able to request be able to create new account" : function (client) {
//     client
//       .expect.element("#signUpPageEmailInput").to.be.visible
//       .expect.element("#signUpPagePasswordInput").to.be.visible
//       .expect.element("#signUpPagePasswordInput").to.be.visible
//       .expect.element("#signUpPageJoinNowButton").to.be.visible
//   },
//   "guest should be notified if username already exists" : function (client) {
//     client
//
//   },
//
//   "guest should be notified if passwords do not match" : function (client) {
//     client
//
//   },
//   "guest should be notified if email is not correctly formatted" : function (client) {
//     client
//
//   },
//   "when new user fills out form and registers, new user should get created" : function (client) {
//     client
//
//   },
//   "when user signs in with username and password, should redirect to home page" : function (client) {
//     client
//
//   },
//   "user should be able to request reset password email" : function (client) {
//     client
//
//   },
//   "existing user should be able to sign in on desktop" : function (client) {
//     client
//
//   },
//   "existing user should be able to sign in on tablet" : function (client) {
//     client
//
//   },
//   "existing user should be able to sign in on phone" : function (client) {
//     client
//
//   },
// };
