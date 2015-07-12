Session.toggle = function(session_variable){
  if(Session.get(session_variable) === undefined){
    Session.set(session_variable, undefined);
  }else if(Session.get(session_variable) === null){
    Session.set(session_variable, null);
  }else if(Session.get(session_variable) === true){
    Session.set(session_variable, false);
  }else if(Session.get(session_variable) === false){
    Session.set(session_variable, true);
  }
  return true;
};
Session.clear = function(session_variable){
  Session.set(session_variable, null);
  return true;
};
Session.remove = function(session_variable){
  Session.set(session_variable, undefined);
  return true;
};

Session.setAll = function(object){
  console.log('object', object);

  for (var key in object) {
    if(object.hasOwnProperty(key)){
      console.log(key + " = " + object[key]);
      Session.set(key, object[key]);
    }
  }
  return true;
};
