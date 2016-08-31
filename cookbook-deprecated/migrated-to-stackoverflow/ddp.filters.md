#### Filtering Subscriptions With Regexes

Simple pattern for filtering subscriptions on the server, using regexes, reactive session variables, and deps autoruns.

````js
// create our collection
WordList =  new Meteor.Collection("wordlist");

// and a default session variable to hold the value we're searching for
Session.setDefault('dictionary_search', '');

Meteor.isClient(function(){
    // we create a reactive context that will rerun items when a Session variable gets updated 
    Deps.autorun(function(){
        // and create a subscription that will get re-subscribe to when Session variable gets updated
        Meteor.subscribe('wordlist', Session.get('dictionary_search'));
    });
    
    Template.dictionaryIndexTemplate.events({
        'keyup #dictionarySearchInput': function(evt,tmpl){
            // we set the Session variable with the value of our input when it changes
            Session.set('dictionary_search', $('#dictionarySearchInput').val());
        },
        'click #dictionarySearchInput':function(){
            // and clear the session variable when we enter the input
            Session.set('dictionary_search', '');
        },
    });
});
Meteor.isServer(function(){
    Meteor.publish('wordlist', function (word_search) {
        // this query gets rerun whenever the client subscribes to this publication
        return WordList.find({
            // and here we do our regex search
            Word: { $regex: word_search, $options: 'i' }
        },{limit: 100});
    });
});
````

````html
<input id="dictionarySearchInput" type="text" placeholder="Filter..." value="life"></input>
````

This pattern itself is pretty straight forward, but the regexes may not be.  If you're not familiar with regexes, here are some useful tutorials and links:

[Regular Expression Tutorial](http://www.regular-expressions.info/tutorial.html)  
[Regular Expression Cheat Sheet](http://www.cheatography.com/davechild/cheat-sheets/regular-expressions/)  
[Regular Expressions in Javascript](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_Expressions)  


