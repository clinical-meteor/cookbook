## Creating a Symptomatic Plugin

### Overview    
A Symptomatic Plugin is an [Atmosphere](https://atmospherejs.com) package for the [Meteor](https://www.meteor.com/) javascript framework, which conforms to a specific API interface.  You'll want to familiarize yourself with the [Meteor Guide](https://guide.meteor.com/) to get started, with particular attention to the section on [Writing Atmosphere Packages](https://guide.meteor.com/writing-atmosphere-packages.html).

Atmosphere packages are javascript meta-packages, and may contain references to Node packages or the Node Package Manager (Npm).  The nice thing about Atmosphere packages is that they abstract a lot of the technical details out of the way.  Generally speaking, Atmosphere packages focus on clinical and healthcare business logic, compared to Node packages which focus on technology implementation.


### Architecture Diagram

Plugins generally follow a microservice architecture, which support all the functionality to store data in a collection in the Mongo database and display it on the client.  By default, it will coordinate data transfer across three different devices (database, server, and client) using either the DDP or REST protocol.  

![MeteorMicroserviceArchitecture](https://raw.githubusercontent.com/clinical-meteor/cookbook/master/images/MeteorMicroserviceArchitecture.png)  

### Implementation Checklist  
To implement a complete plugin using all available features and fully integrating into the Symptomatic architecture, one would want to implement the following items:  

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
- [ ] event hooks
    
### Reference Implementation  

The defecto gold-standard plugin for the Symptomatic platform is the [clinical:hl7-resource-patient](https://github.com/clinical-meteor/hl7-resource-patient) package. It contains the latest code, most functionality, and is kept under quality control.  


### Symptomatic Plugin API  

Symptomatic extends the underlying Atmosphere plugin architecture with an API that is specific to the Meteor on FHIR interface engine.  If the following objects are exported from the package with the appropriate fields, Meteor on FHIR will be able to pick up the UI/UX elements and display them.  

- **DynamicRoutes**   
  _name_: String  
  _path_: String  
  _component_: Object  
  _requireAuth_: Boolean  

- **SidebarElements**    
  _primaryText_: String    
  _to_: String   
  _href_: String  

- **AdminSidebarElements**    
  _primaryText_: String    
  _to_: String   
  _href_: String  

- **FooterElements**    
  _label_: String    
  _className_: String    
  _style_: Object  
  _onClick_: Function    

- **MainIndexTiles**      
  _primaryText_: String    
  _to_: String   
  _href_: String   
  _icon_: String   

- **ThemingAssets**      
  _name_: String    
  _src_: String   


To better understand how this works, take a look at the [imports/client/startup/routes.js](https://github.com/clinical-meteor/meteor-on-fhir/blob/development/webapp/imports/client/startup/routes.js#L88-L97) file, and how it parses through the packages looking for the `DynamicRoutes` API.  

```js
// Pick up any dynamic routes that are specified in packages, and include them
var dynamicRoutes = [];
Object.keys(Package).forEach(function(packageName){
  if(Package[packageName].DynamicRoutes){
    // we try to build up a route from what's specified in the package
    Package[packageName].DynamicRoutes.forEach(function(route){
      dynamicRoutes.push(route);      
    });    
  }
});
```

Similar functionality is implemented in the `Footers.js`, `Sidebar.js`, and `MainIndex.js` files and elsewhere.

### Index.jsx  

The plugin API is generally implemented within the [index.jsx](https://github.com/clinical-meteor/hl7-resource-patient/blob/master/index.jsx) file of the package.  


```js
// import UI/UX components from files in the plugin
import PatientDetail from './client/react/PatientDetail.js';
import PatientPickList from './client/react/PatientPickList.js';
import PatientsPage from './client/react/PatientsPage.js';
import PatientTable from './client/react/PatientTable.js';
import PatientsPage from './client/react/PatientsPage';
import Patients from './lib/Patients.js';

// import external dependencies 
import Heartbeat from 'react-icons/lib/fa/heartbeat';

// create the interface objects that Symptomatic expects
var DynamicRoutes = [{
  'name': 'PatientPage',
  'path': '/patients',
  'component': PatientsPage,
  'requireAuth': true
}];

var SidebarElements = [{
  'primaryText': 'Patients',
  'to': '/patients',
  'href': '/patients'
}];

var FooterElements = [{
  'label': 'View Patients',
  'className': 'button',
  'style': {
    'color': 'black'
  },
  'onClick': function(){
    console.log('Navigating to /patients page');
  },
  'href': '/patients'
}];

var MainIndexTiles = [{
  'primaryText': 'Patients',
  'to': '/patients',
  'href': '/patients',
  'icon': Heartbeat
}];

export { 
  // attach the plugin API objects
  SidebarElements, 
  DynamicRoutes, 
  FooterElements, 
  MainIndexTiles,

  // as well as the components that will be used
  PatientsPage,
  PatientDetail,
  PatientPickList,
  PatientTable,
  Heartbeat,

  // and any data schemas or other libraries
  Patient,
  Patients,
  PatientSchema
};
```



### Other Notes  

- Read the [Meteor on FHIR README](https://github.com/clinical-meteor/meteor-on-fhir).
- Read through the [Clinical Meteor Quickstart](https://github.com/clinical-meteor/software-development-kit/blob/master/documentation/getting.started.md) to set up your development environment.
- Reference the [Software Development Kit](https://github.com/clinical-meteor/software-development-kit) as needed.


