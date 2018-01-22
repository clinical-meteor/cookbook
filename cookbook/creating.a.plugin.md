## Creating a Plugin Quickstart  

- A Symptomatic Plugin is an Atmosphere package for the Meteor javascript framework, which conforms to a specific interface.   
- Atmosphere packages are javascript meta-packages, and may contain references to Node packages or the Node Package Manager (Npm).  The nice thing about Atmosphere packages is that they abstract a lot of the technical details out of the way.  Generally speaking, Atmosphere packages are more clinical and healthcare related, compared to Node packages. 
- Symptomatic Plugin API
    - DynamicRoutes
    - SidebarElements
    - FooterElements
    - MainIndexTiles

- Plugins generally follow a microservice architecture, which support all the functionality to store data in a collection in the Mongo database and display it on the client.  Such functionality typically includes:
    - a data schema
    - a Mongo collection
    - a server-side cursor
    - a client-side cursor
    - a set of basic REST endpoints
    - a publication/subscription
    - a dynamic route
    - a main page
    - a sidebar element
    - a menu tile
    - a javascript class
    - verification tests
    - validation tests

- The defecto gold-standard plugin for the Symptomatic platform is the clinical:hl7-resource-patient package.  You’ll generally want to copy it and 
