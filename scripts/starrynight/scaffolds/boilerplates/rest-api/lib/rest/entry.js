//==============================================================================
// LOGIN / AUTHENTICATION

// https://github.com/EventedMind/iron-router

Router.route('/login', function () {
  this.response.statusCode = 200;
  this.response.setHeader("Campaigns-Type", "application/json");
  this.response.setHeader("Access-Control-Allow-Origin", "*");
  this.response.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Campaigns-Type, Accept");

  if (this.request.method == 'POST') {

    // update our statistics counter
    Statistics.update({_id: "configuration"},{$inc:{
      total_count: 1
    }});

    // TODO: this is where we could add validation and testing with simple-schema

    if(!this.request.body.username){
      this.response.end("Please specify a username.");
    }else if(!this.request.body.password){
      this.response.end("Please specify a password.");
    }else{
      var loginResult = false;

      // make sure the user exists
      var user = Meteor.users.findOne({username: username});
      if (!user){
        this.response.statusCode = 403;
        this.response.end("User not found.");
      }

      // this example assumes passwords are used
      // otherwise, replace this logic with oauth specific logic
      if (!user.services || !user.services.password){
        console.error("User has no password set.");
        this.response.statusCode = 403;
        this.response.end("User has no password set.");
      }

      // check non secure-remote-passwords
      if (!user.services.password.srp) {
        // Meteor 0.8.2+
        // https://dweldon.silvrback.com/check-password
        var passwordCheckResult = Accounts._checkPassword(user, password);

        if (passwordCheckResult.error){
          this.response.statusCode = 403;
          this.response.end("Incorrect password.");
        }
      }

      // check secure-remote-passwords and extend the accounts system
      // https://meteorhacks.com/extending-meteor-accounts.html

      // generate a session token for the client
      var stampedLoginToken = Accounts._generateStampedLoginToken();

      // update the user account with the session token
      Meteor.users.update(user._id, {
        $push: {'services.resume.loginTokens': stampedLoginToken}
      });

      // send the session token back to the user
      this.response.end(JSON.stringify(
        {result: {
          userId: user._id,
          loginToken: stampedLoginToken.token
        }}
      ));
    }

  }else if (this.request.method == 'OPTIONS') {
    this.response.setHeader("Access-Control-Allow-Methods", "POST, PUT, GET, DELETE, OPTIONS");
    this.response.end("OPTIONS Response, as per the Cross-Origin Resource Sharing standard.");
  }else{
    this.response.end("Please send as a POST request.");
  }
}, {where: 'server'});


//==============================================================================
// LOGOUT

Router.route('/logout', function(){
  this.response.statusCode = 200;
  this.response.setHeader("Campaigns-Type", "application/json");
  this.response.setHeader("Access-Control-Allow-Origin", "*");
  this.response.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Campaigns-Type, Accept");

  if (this.request.method == 'POST') {

    // update our statistics counter
    RestStatistics.update({_id: "configuration"},{$inc:{
      total_count: 1
    }});

    // remove the user login/session tokens
    Meteor.users.update({username: username}, {
      $push: {'services.resume.loginTokens': null}
    });

    this.response.end(JSON.stringify(logoutResult));


  }else if (this.request.method == 'OPTIONS') {
    this.response.setHeader("Access-Control-Allow-Methods", "POST, PUT, GET, DELETE, OPTIONS");
    this.response.end("OPTIONS Response, as per the Cross-Origin Resource Sharing standard.");
  }else{
    this.response.end("Please send as a POST request.");
  }
}, {where: 'server'});
