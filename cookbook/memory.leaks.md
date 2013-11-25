Well, the myScopedVariable example is the canonical approach.  And, generally speaking, since it works in RAM and there's garbage collection, it winds up being fast enough and robust enough for most javascript apps.  But it's important to remember that var does, in fact, write something to the RAM memory stack.  And depending on your app, those vars can add up.
  
````js  
// purely functional, ala lisp; doesn't write a variable to the stack
// about as fast as you're possibly going to get; no memory leaks
fastAdd = function(first, second){
  return first+ second;
}
 
// slightly object oriented, in that it writes a variable to the stack  
// should always get cleaned up by garbage collection; but a micro-millisecond slower and more expensive
slightlySlowerAdd = function(first, second){
  var result;
  result = first + second;
  return result;
}
```

By contrast, the new keyword writes to the memory heap.  And that's an order of magnitude more expensive.  Like Ran says... you can usually get away with using vars; but new is a bit more problematic.  And, as Naomi says, garbage collection should take care of things.  But, in my experience, the new keyword is antipattern-ish, unless you're actively managing your own memory.  I don't trust the garbage collector, and find my code works better the fewer news I have in it.    

````js
// object oriented; writes an object to the heap, with it's own private stack space; prone to memory leaks (imho)
// feel free to nitpick regarding object literals, object constructors, and prototypes; I'm not 100% sure on their details
Calculator = {
  add: function(first, second){
    var result = first + second;
    return result;
  }
} 
verySlowAdd = function(first, second){
  var calculator = new Calculator(); 
  return calculator.add(first, second);
}
````

Generally speaking, you'll run into memory leaks with new before you run into them with vars.

That being said, depending on the code and app you're developing, don't rule out vars being the cause of memory leaks.  I've seen them cause memory leaks in two particular cases:  with closures, where some other object retains reference to an inner scope; and with differential equations, graphing, double buffering, and other operations that need to work at 24+ frames per second.  When you're trying to create code that's optimized for a video pipeline, the garbage collection just doesn't work fast enough.  So, if you're using the D3 libraries or writing differential equations, be on the lookout for leaky vars.

As for closures, I'm still a little fuzzy on the exact antipattern, but this is how I understand it:

````js
// this closure won't leak; particularly because it's so simple
// but it's potentially problematic 
potentiallyLeakyAdd = function(first, second){
  var result = 0;
  function addInputs(){
    result = first + second;
  } 
addInputs();
  return result; 
} 

// as the closure gets more complicated with more logic, variables can get added
// which reference the inner scope; which will cause the garbage collector to skip it during clean up 
var dangerousVariable = 0; 
leakyAdd = function(first, second){
  var result = 0;
  function addInputs(){
    dangerousVariable = first + second;
    result = dangerousVariable;
  } 
addInputs();
  return result; 
} 
`````          
          
