Atom
==================================

If there was one preferred editor for hacking on Meteor, what would it be?  Atom.  Why?  Because of Meteor principle #1: Pure Javascript, and the bliss that is isomorphic software.  
[atom.io](https://atom.io/)

Meteor's roots started when Google open-sourced the V8 engine and the good folks at Joyent decided to build a server with it.  That idea of using the same code on both the server and client started off the isomorphic software movement.  Initially, however, people tried to replicate Apache, Tomcat, and ASP Server functionality in Node.js, and what resulted for a few years was a divergence between client-side javascript APIs and server-side javascript APIs.  Meteor entered the picture with the promise to throw out the existing divergent APIs, and to provide an isomorphic API common to both server and client.  The idea that separated Meteor from other competing frameworks, is that they decided to extend the concept of Pure Javascript to the database, and selected Mongo as their data store.

With Server, Client, and Database all using the same javascript APIs, the question is:  what's next?  As of 0.9, the next round of work is being done with Cordova, and bringing the isomorphic API to the mobile device.  

The fifth leg of this isomorphic framework is the IDE.
