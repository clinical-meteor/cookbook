## Grammar

**Semicolons**
Obviously, everybody has their own opinions about grammar, and the Javascript specification (ECMA5 whatever) says that semicolons are optional.  Fair enough.  But here's a reason to use semicolons:  eventmaps.

````js
// eventmap will fail
Template.topicsPage.events({
    'click .button':function(){
        console.count('initialize-rooms')   // note the missing semicolon
    }
})

// eventmap will run correctly
Template.topicsPage.events({
    'click .button':function(){
        console.count('initialize-rooms');
    }
})

````

**Variable and Function Names**
Speaking of global contexts, when you bring variables into the global scope, err on the side of verbose names.  A rule-of-thumb I use is any varible in the local scope should be at least 6 characters long.

````js
// bad!  creates unreadable code
var f = 0;

// still too short
var foo = 0;

// much better!
fooCount = 0;

// ideal
currentFooIndex = 0;
````

The reason behind wanting to use long variable names has to do with the entropic information density of longer strings, which leads to less name collissions.  This is particularly useful when refactoring.  Sometimes you'll want to do a global Find And Replace on just 'foo' elements, or just 'count' elements, or just 'current' elements, etc.  Having long names will help in refactoring, and prevent name collisions.  Short, concise names are prone to causing name collisions.  Also this rule-of-thumb about name lengths applies to function names too.



