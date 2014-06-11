## Writing Acceptance Tests  


#### Acceptance Unit Tests  
Unlike acceptance tests, which treat your application as a black-box closed system, and only test inputs and outputs; unit testing treats your application as an open system, and has access to all the internals of your application.  As such, it needs a different kind of testing.  And that's why we use TinyTest.  

````js
// create your application
meteor create helloworld
cd helloworld

// add the tinytest package
meteor add tinytest

// run your application
sudo mrt

// open a second browser and run the test packages
sudo mrt test-packages
````

