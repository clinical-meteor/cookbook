## Grammar  

**Semicolons**  
For those people new to Javascript and coming from other languages, lets talk grammar for a moment.  Specifically, lets talk about semicolons.  Now, technically speaking, the Javascript ECMA5 specifications state that semicolons are optional.  However, in practice, there are two important steps in the Meteor code deployment process where semicolons come into play.  The first is Meteor's bundling and minification process, and the second is the V8 javascript runtime interpreter.  Both of these technologies will parse your javascript.  One is attempting to optimize it; the other is attempting to run it.  In both processes, they need to parse the javascript, and determine where the end of each statement is.

````js
//example without semicolon
var myVar = 9
if (myVar === 9) {

}

//when minified, may become:
var myVar 9 if (myVar == 9) {}


//same example with semicolon
var myVar = 9;
if (myVar === 9) {

}

//when minified, may become:
var myVar 9; if (myVar == 9) {}
````

To make a long story short, until you're fluent with javascript, and know all the rules of how both the Meteor compiler will lint and minify your code, and how the V8 compiler will do semicolon insertion, the safest bet is to treat the Javascript environment as if it randomly inserts semicolons.  It's not actually inserting them randomly - there are quite specific rules on how it inserts them - but until you learn those rules, it will seem as though it's random.  As such, in order to avoid the javascript interpreter from randomly inserting semicolons into your code, it's best that you be explicit about putting the semicolons in yourself.  

````js
// good
return {
	javascript : "fantastic"
};

// bad!
return
{
	javascript : "fantastic"
};

// interpreted bad code
return; // Semicolon inserted, believing the statement has finished. Returns undefined
{ // Considered to be an anonymous block, doing nothing
	javascript : "fantastic"
};
````


In practice, you'll find that the majority of instances where semicolons are important involve linters, minification, eventmaps, and code involving anonymous functions.  Here are some extra links for additional reading and research if you're interested.  But suffice it to say... until you learn the rules of how the javascript V8 interpreter inserts semicolons, save yourself a bunch of headaches and add them in yourself.

[Stackoverflow - Why Use Semicolons](http://stackoverflow.com/questions/2399935/why-use-semicolon)  
[Javascript Semicolon Tutorial](http://www.howtocreate.co.uk/tutorials/javascript/semicolons)  
[Beware of Javascript Semicolon Insertion](http://robertnyman.com/2008/10/16/beware-of-javascript-semicolon-insertion/)  




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



