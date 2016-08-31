Meteor's Reactivity Design
==========================
http://docs.meteor.com/#/full/reactivity

Think changes in database will update everywhere.  Do I use Tracker or Observe/Cursor?
Cursor uses Tracker. There are rarely cases where you need to use Tracker. Use Cursor or Session for reactivity. 
http://docs.meteor.com/#/full/mongo_cursor

