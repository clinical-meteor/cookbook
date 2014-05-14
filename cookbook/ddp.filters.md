#### Filtering Subscriptiosn With Regexes

````js


WordList =  new Meteor.Collection("wordlist");

Meteor.isClient(function(){
    Meteor.autorun(function(){
        Meteor.subscribe('wordlist', Session.get('word_search'));
    });
    
    Template.dictionaryIndexTemplate.events({
        'keyup #dictionarySearchInput': function(evt,tmpl){
            Session.set('dictionary_search', $('#dictionarySearchInput').val());
        },
        'click #dictionarySearchInput':function(){
            Session.set('selected_word', '');
        },
    });
});
Meteor.isServer(function(){
    Meteor.publish('wordlist', function (word_search) {
        return WordList.find({
            Word: { $regex: word_search, $options: 'i' }
        },{limit: 100});
    });
});
````

````html
<input id="dictionarySearchInput" type="text" placeholder="Filter..." value="life"></input>
````

[Regular Expressions in Javascript](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_Expressions)  


