 
#### Local Storage

Local storage comes in a couple of varieties.  There's local storage of  
- the static application assets
- the minimongo collections
- session variables


To store session variables locally via Amplify, using key/value pairs, do the following:  
````js
// dependency installation
mrt add amplify
 
// helper function
amplifiedSession = _.extend({}, Session, {
    keys: _.object(_.map(amplify.store(), function (value, key) {
        return [key, JSON.stringify(value)];
    })),
    set: function (key, value) {
        Session.set.apply(this, arguments);
        amplify.store(key, value);
    }
});
 
//getter
AmplifiedSession.get('sort_by')
 
//setter
AmplifiedSession.set('sort_by', 'score');
````
