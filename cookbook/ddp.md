## Data-Distribution Protocol

#### Filtering by Regex

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

**Regular Expressions in Javascript**  
https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_Expressions

````html
<input id="dictionarySearchInput" type="text" placeholder="Filter..." value="life"></input>
````



#### Multi-User Patterns

````js

// client/subscriptions.js  
Meteor.subscribe('usersDirectory');
Meteor.subscribe('userProfile', Meteor.userId());

// server/publications.js  
// Publish users directory and user profile

Meteor.publish("usersDirectory", function (userId) {
    try{
        return Meteor.users.find({}, {fields: {
            '_id': true,
            'username': true,
            'emails': true,
            'emails[0].address': true,

            // available to everybody
            'profile': true,
            'profile.name': true,
            'profile.avatar': true,
            'profile.role': true
        }});
    }catch(error){
        console.log(error);
    }
});
Meteor.publish('userProfile', function (userId) {
    try{
        return Meteor.users.find({_id: this.userId}, {fields: {
            '_id': true,
            'username': true,
            'emails': true,
            'emails[0].address': true,

            'profile': true,
            'profile.name': true,
            'profile.avatar': true,
            'profile.role': true,

            // privately accessible items, only availble to the user logged in
            'profile.visibility': true,
            'profile.socialsecurity': true,
            'profile.age': true,
            'profile.dateofbirth': true,
            'profile.zip': true,
            'profile.workphone': true,
            'profile.homephone': true,
            'profile.mobilephone': true,
            'profile.applicantType': true
        }});

    }catch(error){
        console.log(error);
    }
});
````

