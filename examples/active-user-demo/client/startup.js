Meteor.startup(function(){

  if(process.env.METEOR_ENV === "development"){
    console.log("Running in " + process.env.METEOR_ENV);
  }

  if(process.env.DEBUG === "true"){
    Env.display();
  }
});
