Meteor.startup(function(){
    console.log("Starting up " + process.env.DOMAIN + " in " + process.env.METEOR_ENV);

    if(process.env.METEOR_ENV === "development"){
      /*console.log("process.env", process.env);*/
      Env.display();
    }
});


Env.allow({
  DEBUG: true,
  TRACE: true,
  METEOR_ENV: true,
  DOMAIN: true,
  SECRET_KEY: false
});
