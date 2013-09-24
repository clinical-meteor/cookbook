### Yet Another Attempt to Describe Monads, Lambda Calculus, etc.
This section is still in draft form.  I'll be moving into D3 interactives this Winter, and will be adding many code samples here.  Stay tuned.



- Like the terms 'Object' and 'Class', the term 'Monad' has a bunch of different meanings.  Don't get overly bogged down with the technical definitions.  Particularly the Maybe, Writer, and I/O definitions.  They'll distract you at the beginning; and really won't help you write D3 visualizations.  Just remember that Monad's are computation objects or method chains, and they need a Beginning and End, and an Input and an Output.  

- Most tutorials you'll see written on Monads are written in purely functional programming languages, like Lisp, Scheme, or Haskell.  The syntax is considerably different between them and Javascript, so you'll need to imagine lots and lots of parenthesis and braces added to all of the Lispy tutorials you run across.  
http://en.wikipedia.org/wiki/Monad_(functional_programming)#The_Maybe_monad  

- If you use a Mac, there's a UI application for programming Monads called Automator.  It's possibly the most single powerful application in the entire OSX operating system.  
http://support.apple.com/kb/HT2488  

- Monads generate most of their magic through side-effects.  

- Monads and Objects are inverses of each other.  There's a Yin/Yang thing going on.

- Monads are focused on the function, the becoming, the doing, the verb.  Objects are focused on the state, the presence, the noun.

- Any Object can be described as a Monad; any Monad can be described as a Object.  They are formally translatable to each other.  But they're based on very different worldviews and perspectives.  

- There's a front-loading version of Monad and method-chains, that often uses a selector of some type (jQuery, D3, others).  
&#5783;&#5782;&#5761;&#5766;&#5761;&#5761;&#5760;&#5760;&#5760; 

- And there's a back-loading version.  The back-loading versions are the hardest to learn.  It's very much like learning to read Reverse Polish Notation (RPN) or German, where the verbs are at the very end of the sentence.  Only, with method-chains, it's the data input that's at the very end of the chain.  
&#5783;&#5761;&#5766;&#5761;&#5761;&#5760;&#5760;&#5760;&#5782;


- Also, Monads have a very Alice-In-Wonderland habit of referencing things that don't exist with their selectors, then instantiating those very things as side effects of the computation on the data that's passed into them.  It's completely contrary to what you'd expect.  Sort of like levitating or literally lifting one's self off the ground.   

- I tend to think of Monads in terms of 4D tunnels.  Sort of like Donnie Darko.  Weird analogy, I know.  But surprisingly useful.

- The best book I've ever ran across that dealt with Monads was actually Neal Stephenson's The Baroque Cycle.  It's like 3,000 pages of Newton vs Leibniz, but has great characters like Eliza and Daniel and Jack.  Oddly enough, it really helps to understand the historical context between Newton's and Leibniz's calculus, because most of the Church/Turing Lambda Calculus is based off of Leibniz's conceptions of Monads.  Be warned....  The Baroque Cycle is written as a mobius strip, so you may likely need to read it twice to understand the entire plot.  

- Once you read Baroque Cycle, Leibniz, Church/Turing, Donnie Darko, etc....  this following statement will make a bit more sense:  Monads are sort of about computational surface area.  One might go so far as to say quantized computational surface area.  

- And going from that, you might say that they're... sort of like a derivative or integral of an Object.  They live on the circumference of objects.  On the surface area of objects.  They're like arteries and capillaries that objects move through.  

- It took me a few years to get a handle on method chaining and monads.  So, be aware that this is one of those topics that you may need to meditate on!

- There's a reason it's called the &#955; calculcus, and not the &#950; calculus or the &#958; calculus.  The &#955; pictographically represents branching.  Specifically, it represents a single simple branch off a line.  And that fundamentally represents what the basic binding/substitution function is all about in the &#955; calculus.  At it's heart, the &#955; calculus is about this one simple function that forks.  We just happen to use that forking function over and over and over a bazillion times.  And we can derive all of geometry and algebra and calcullus from it.   
http://en.wikipedia.org/wiki/Lambda_calculus

- In Javascript, you most often see &#955; functions at work as ``anonymous functions``.    Whenever you use an anonymous function, you're sprinkling your application with Lambda Calculus sparkly goodness.  You can see that Meteor has lambda functions sprinkled throughout it's core functions.  

````js


// they can be the argument of a function themselves
Deps.autorun(function(){ ... });

Meteor.startup(function(){ ... });

// or they can be parameters to objects that are passed into functions
Meteor.methods({
  foo: function(){ ...}
});
````

- When naming Monads, I generally use one of three approaches.  

````js
// use -ing or -ator suffixe
coffeeMaker = new CoffeeExtrator();
coffeeMaker.brewing();
coffeeMaker.loading(beans);

// imperative verb such
brew = function(beans){
  result {};
  result.beans = beans;
  result.roast = false;
  result.aroma = function(){
    return random(16);
  }
  return result;
}
brew(coffeeMaker.beans);
````

But often times, in practice, one doesn't go about *naming* a Monad.  That is, one doesn't think up a name for a Monad, and then go about writing that Monad.  I don't think I've ever written a Monad that way, anyhow.  Far more often, you'll have a series of functions you're trying to chain together, and you name the Monad in hindsight.  It's far more often to say 'oh, I guess that was a ``beanExtractionCaffieneBrewingMonad`` that I was trying to create'.  Naming a Monad is quite often an exercise in humility.  If you have a sense of 'well, I would have never thought of that on my own' when naming one, you're probably on the right track.      

In practice, they'll far more often look like this, and the best you'll be able to do is add a comment.

````js
  // FastCircleSliding 
  d3.selectAll("circle").transition()
    .duration(750)
    .delay(function(d, i) { return i * 10; })
    .attr("r", function(d) { return Math.sqrt(d * scale); });
````

### Notation Samples

&#5782;&#5783;


&#5783;&#5761;&#5766;&#5761;&#5761;&#5760;&#5760;&#5760;&#5782;

&#5782;&#5783;



&#955;  
&#955;&#955;  
&#955;&#955;&#955;  



&#9149;&#9149;&#9149; &#9095; &#9149;&#9149;&#9149;

&#9187;
