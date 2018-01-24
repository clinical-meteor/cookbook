## Creating a Plugin Quickstart  

#### Architecture  
- A Symptomatic Plugin is an Atmosphere package for the Meteor javascript framework, which conforms to a specific interface.  

- Atmosphere packages are javascript meta-packages, and may contain references to Node packages or the Node Package Manager (Npm).  The nice thing about Atmosphere packages is that they abstract a lot of the technical details out of the way.  Generally speaking, Atmosphere packages are more clinical and healthcare related, compared to Node packages.

- The defecto gold-standard plugin for the Symptomatic platform is the [clinical:hl7-resource-patient](https://github.com/clinical-meteor/hl7-resource-patient) package. It contains the latest code, most functionality, and is kept under quality control.  


#### Symptomatic Plugin API  
    - DynamicRoutes
    - SidebarElements
    - FooterElements
    - MainIndexTiles

#### Implementation Checklist  
- Plugins generally follow a microservice architecture, which support all the functionality to store data in a collection in the Mongo database and display it on the client.  Such functionality typically includes:
    - [ ] a data schema
    - [ ] a Mongo collection
    - [ ] a server-side cursor
    - [ ] a client-side cursor
    - [ ] a set of basic REST endpoints
    - [ ] a publication/subscription
    - [ ] a dynamic route
    - [ ] a main page
    - [ ] a sidebar element
    - [ ] a menu tile
    - [ ] a javascript class
    - [ ] verification tests
    - [ ] validation tests


#### Getting Started  

- Read the [Meteor on FHIR README](https://github.com/clinical-meteor/meteor-on-fhir).
- Read through the [Clinical Meteor Quickstart](https://github.com/clinical-meteor/software-development-kit/blob/master/documentation/getting.started.md) to set up your development environment.
- Familiarize yourself with the [Meteor Guide](https://guide.meteor.com/) to get started with developing Meteor.
- Reference the [Software Development Kit](https://github.com/clinical-meteor/software-development-kit) as needed.


#### Notes  


