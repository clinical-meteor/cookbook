## Schema Design 

**Q:  How should I go about designing my collections?**  
Well, instead of telling you what you ought to do; how about I tell you how I go about designing *my* collection schemas.  I've been working with Mongo for a couple years now, and document oriented database for maybe 8 years now.  There are few rules I use nowdays when designing data storage collections:

1.  Don't do data modeling in the database.  
2.  Do a careful analysis of the most commonly used queries in your application instead.   
3.  Collection schemas should be designed for optimizing server/client communications.  
4.  Therefore, collections should reflect the types of queries the application is going to perform.  
5.  If its not worth storing a billion records, odds are that it doesn't actually need to be a collection.   
6.  Collections with just 2 or 3 fields, or only a few dozen records are suspicious in the Mongo world.  
7.  If a table is so small it can be converted into an enum, do so.    
8.  Consolidate and merge tables.  
9.  Think in terms of document schemas, rather than table schemas.  
10.  Table schemas should be about performance.  
11.  Document schemas are where you want to do your data modeling.  
