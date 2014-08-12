Performance Optimization  
==============================

First off, lets be clear that Meteor is simply Javascript and Node.js.  Yes, it's a very specific implementation of those two technologies, and has it's own unique ecosystem, and leverages isomorphic APIs and a JSON datastore to achieve some truly amazing results.  But, at the end of the day, Meteor is a web technology, and it's written in Javascript.  So all of your typical javascript performance techniques still apply.  

===========================
Tutorials on Writing Performant Javascript

[25 Javascript Performance Techniques](http://desalasworks.com/article/javascript-performance-techniques/)  
[Performance Optimizations for High Speed Javascript](http://www.webreference.com/programming/javascript/jkm3/index.html)  
[Optimizing JavaScript Code](https://developers.google.com/speed/articles/optimizing-javascript)  
[Performance Tips for JavaScript in V8](http://www.html5rocks.com/en/tutorials/speed/v8/)  
[10 Javascript Performance Boosting Tip](http://jonraasch.com/blog/10-javascript-performance-boosting-tips-from-nicholas-zakas)  
[Write Efficient JavaScript](http://oreilly.com/server-administration/excerpts/even-faster-websites/writing-efficient-javascript.html)  


===========================
Designing and Deploying Production Ready Software  

Also, all the best practices of typical web architecture still apply.  I recommend Michael Nygard's excelent book [Release It!  Design and Deploy Production-Ready Software](http://www.amazon.com/Release-It-Production-Ready-Pragmatic-Programmers/dp/0978739213).  It may be writen in Java, not Javascript, but it's coverage of patterns and antipatterns in designing large websites is invaluable. 

**Stability Patterns**
- Timeouts
- Circuit Breakers
- Bulkheads
- Handshaking

**Stability Anti-Patterns**  
- Integration Points
- Third Party Libraries
- Scaling Effects
- Unbalanced Capabilities

**Capacity Anti-Patterns**  
- Resource Pool Contention
- AJAX Overkill
- Overstaying Sessions
- Excessive White Space
- Data Eutropification

===========================
Kadira


https://kadira.io/


#### Help!  My application has gotten slow and sluggish!  
The good folks over at Project Richochet have a great writeup on this...  
http://projectricochet.com/blog/meteor-js-performance#.Uov3V2Tk_fi  

Also, try the following things:  
- install the appcache package
- compress your images
- exclude the .meteor directory from your IDE
- use SSD drives to eliminate disk IO times to the cache
- host image assets on another server and hyperlink

