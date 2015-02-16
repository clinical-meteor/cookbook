

In response to the classic article [Why You Should Never Use MongoDB](http://crater.io/posts/TYmdcGm5NayDJXD2k).

####1.  Established & Enterprise Grade  

First, of all, lets just understand that documented oriented databases are more than 40 years old, and an extremely established technology in some industries.  Specifically, the first electronic medical record (ie. the healthcare industry) ever written was the Massachusetts General Hospital Multi-Programming System, back in 1966.  That's before the SQL movement took off.

[http://en.wikipedia.org/wiki/MUMPS](http://en.wikipedia.org/wiki/MUMPS)  
[http://en.wikipedia.org/wiki/Epic_SystemsVista](http://en.wikipedia.org/wiki/Epic_SystemsVista)  
[http://en.wikipedia.org/wiki/VistA](http://en.wikipedia.org/wiki/VistA)  

MUMPS powers both the most widely used open-source EMR system in the US (the Veteran's Administration VistA program), as well as the largest proprietary EMR system (Epic Systems).  Something like 40% of all electronic health records run on MUMPS; and certainly all of the largest hospital systems use it.  It's well established in some industries as an enterprise grade technology.  For some industries, it's even more established than SQL.  

####2.  Origami, PostIts and Tickertape  
Sarah is correct when she says 'When the MongoDB folks say “documents,” in many ways, they mean things you can print out on a piece of paper and hold.'  The rejoinder is simply...  origami.  Think of your apps (particularly animations) in terms of origami, and the use of document objects will start making a lot more sense.  

As an example, I'm working on a project right now that has Customers, Techs, Editors, and Admins.  We started out with four different collections, because the previous developer tried to approach the problem as SQL.  In effect, he created four different in-box tray to hold pieces of papers.  In Mongo, the correct solution is to have a single tray, and to treat the different users as different colored pieces of paper.  We wound up using just the Meteor.users collection, and having a Role field, which can be Customer, Tech, Editor, or Admin.  The document schema includes all the fields for all four roles; but depending on the color of the piece of paper, we fold the user document to fit the needs of each role.  

Also, the criticisms about joins in Mongo are generally server-side concerns.  The servers will have a much larger number of records to process, and a join can block the server response, which can then block your UI.  If you can properly scope which documents are needed by the client, and get the documents over the network, the cost of doing joins on the client is substantially smaller.  So, for instance, some people might think that a Customer might only need to have the data of the Tech that they're working with.  But, from a business case, if you can say that it's acceptable for the Customer to have a list of all of the Techs in their local region/area, you can send that short list down to the client, and generally do joins with that collection without problem.  In that case, the documents are more like PostIts notes.  

####3.  Minimongo - ClientSide ReplicaSet, Cache, and Object Store  
It's important to keep in mind that Sarah didn't have access to Mini-Mongo.  If she had, her article may have been very different, and Diaspora may have been built very differently.  Think of mini-mongo as a client-side replica set.  It's a client side cache.  When she talks about Cache Invalidation, that is exactly what mini-mongo is taking care of.

####4.  Collection Hooks & Cascading Updates  
Also, in her section Duplicate data Duplicate data, she describes a 'dangerous' strategy of 'Updating a user’s data means walking through all the activity streams that they appear in to change the data in all those different places.'  

That's what we have the collection-hooks package for, and why it's one of the few community packages around that's getting consideration to be merged into core.  This pattern isn't as dangerous as it sounds.  With bigger installations, it can snowball into a full-time job, sure.  But it's no worse than having a dedicated database admin on an SQL cluster doing schema migrations.  

####5.  Ad-Hoc Queries  
Personally, I got burned real bad with SQL in hospital environments, where I'd be in a situation in the Emergency Room, with people screaming at me that they couldn't find a record for Jane Doe in the system.  Generally, these situations involved someone getting ready for surgery after a car wreck or other accident, and the surgeons needing to find out if they had allergies to medications or what their blood type was.  Sometimes, the patient was already in surgery, and was bleeding out or some other surprise (tumor the size of a grapefruit!), and the surgeon was frantically fixing things.  

For whatever reasons, ranging from recent marriage and name changes to change of insurance carrier moving the file to a different service tier, the record wasn't available, and they'd ask the clinical analyst (me) to find the record.  And that meant writing an ad-hoc SQL query in 5 to 10 minutes.  Shoot me now, already, and get me out of my misery.  I quit that job; and pity whoever is responsible for it now.

It's the main reason that I switched to Mongo and NoSQL systems.  There have been times when I've thought of writing a similar article entitles 'Why You Should Never Use SQL for EMR Systems'.  


####6.  Horizontal Scaling  
Lastly, there are well-known horizontal scaling issues with SQL, that Mongo is well suited to handle.   I'd rather have my horizontal scaling strategy in place, and play origami with 1000 paper cranes, than deal with SQL cluster caps and schema migrations and ad-hoc queries.


![1000 Paper Cranes](http://fc02.deviantart.net/fs71/f/2012/141/5/0/wallpaper_1000_origami_canes_by_hoschie-d50kwiv.jpg)  

