Worker Processes
===============================================

Sometimes it's necessary to allocate a server to crunching numbers, or doing some type of task, rather than simply serving up web pages or acting as a communications hub.  Setting up a worker node using Meteor is somewhat similar to writing a Meteor command-line utility; in that the focus of each is on server-side processing, rather than client-side templating and user-interfaces.  Here's a basic recipe for setting up a server-side function to calculate fibonacci numbers.  

On the server side:
````js
function runSync(func) {
    var fiber = Fiber.current;
    var result, error;

    var args = Array.prototype.slice.call(arguments, 1);

    func.apply(undefined, [cb].concat(args));
    Fiber.yield();
    if (error) throw new Meteor.Error(500, error.code, error.toString());
    return result;

    function cb(err, res) {
        error = err;
        result = res;
        fiber.run();
    }
}
runSync(myFunction, arg1, arg2);

function myFunction(cb, arg1, arg2) {
    // do my async thing and then call cb(err, result);
}

````

And on the client side:
````
Meteor.call('myFunction', arg1, arg2, function(error, result) {
  this.unblock();
});

```` 
