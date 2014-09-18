

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


