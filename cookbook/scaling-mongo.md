

[How to Achieve Scale with MongoDB](https://www.mongodb.com/presentations/webinar-how-achieve-scale-mongodb?mkt_tok=3RkMMJWWfF9wsRoku6TKd%2B%2FhmjTEU5z16u4pXqC%2Fipt41El3fuXBP2XqjvpVQcNqPLnIRw8FHZNpywVWM8TILNEXt916OAznAWg%3D)  

=========================================
#### Optimizing Mongo Query Performance

.explain()
slow query log

[mtools](http://github.com/rueckstiess/mtools)  
````sh
% mplotqueries --type histogram --group namespace --bucketSize 3600
````

system.profile
mongod log files


[Optimizing MongoDB Compound Indexes](http://emptysqua.re/blog/optimizing-mongodb-compound-indexes)  

````sh
# only use this in development, to flush out queries that do full table scans!
mongod --noteablescan
````
[MongoDB Management Services](https://mms.mongodb.com/)  



=========================================
#### Vertical Scaling

**Measure your working set and index sizes**  
db.serverStatus({workingSet:1}).workingSet  
db.stats().indexSize  

[MongoDB Production Notes](http://docs.mongodb.org/manual/administration/production-notes/)  

````sh
#ubuntu issues
ulimits
swap
NUMA 
NOOP schedule with hypervisors
ext4
RAID10
readahead
noatime
````



=========================================
#### Horizontal Scaling


shard-key selection




