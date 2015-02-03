##Meteor Cookbook  

Hi.  Welcome to the Meteor Cookbook; a FAQ and tutorial culled and curated from over 2 years of emails and discussions from the [meteor] google group and my experiences rolling out packages and apps.  These documents are intended for the intermediate user learning Meteor, who is accustomed to a) object-oriented frameworks and languages, such as Java and C#, and b) relational databases and data structures derived from SQL table schemas.  The focus is on helping the user grow accustomed to functional programming using document oriented databases.  


**[TABLE OF CONTENTS](https://github.com/awatson1978/meteor-cookbook/blob/master/table-of-contents.md)**    

========================================
#### Clinical Meteor Track  

Meteor Cookbook is the official documentation of the Clinical Meteor Track project...  a version of Meteor designed for biomedical, clinical, and healthcare applications.  Check out the project page to learn more, and be aware that these two projects are being run in parallel.  

http://clinical.meteor.com/




##Applet Demos
Links to live versions of the examples associated with this cookbook.  

 

| Live Demo     | Source|    Tests   |  Status  | Meteor Version  |
| ------------- |:----------------:| ----------------| ---------------- | ---------------:|
| [Panel Layout](https://panel-layout.meteor.com)  | [panel-layout](https://github.com/awatson1978/panel-layout) | 24 | ![travis-build](https://travis-ci.org/awatson1978/panel-layout.svg?branch=master)   |  1.0.3.1 |
| [Clinical ActiveRecord](https://clinical-activerecord.meteor.com)  | [clinical-activerecord](https://github.com/awatson1978/clinical-activerecord) | 296 | ![travisci](https://travis-ci.org/awatson1978/clinical-activerecord.svg) |  1.0.3.1 |
| [Minimongo Table](https://minimongo-table.meteor.com)  | [minimongo-table](https://github.com/awatson1978/minimongo-table) | 78 | ![travisci](https://travis-ci.org/awatson1978/minimongo-table.svg) |  1.0.3.1 |
| [REST API](http://rest-api.meteor.com/)  | [rest-api](https://github.com/awatson1978/rest-api) | 10 | ![travisci](https://travis-ci.org/awatson1978/rest-api.svg) | 1.0 |
| [Rest Analytics Pipeline](http://rest-analytics-pipeline.meteor.com/)      | [rest-analytics-pipeline](https://github.com/awatson1978/rest-analytics-pipeline) | 52 | ![travisci](https://travis-ci.org/awatson1978/rest-api.svg) | 1.0 |
| [Offline Todos](http://offline-todos.meteor.com) | [offline-todos](https://github.com/awatson1978/offline-todos) | 93 | ![travisci](https://travis-ci.org/awatson1978/rest-api.svg) | 1.0 |
| [Fonts & Calligraphy](http://fonts.meteor.com/)   | [fonts-site](https://github.com/awatson1978/fonts-site) |  15  | ![travisci](https://travis-ci.org/awatson1978/rest-api.svg) | 1.0 |
| [Geolocated Parties](https://github.com/awatson1978/leaflet-parties)   | [leaflet-parties](https://github.com/awatson1978/leaflet-parties) | --- | --- | 1.0 |
| [ Grays Anatomy Images ](http://image-link-archive.meteor.com/) | [image-link-archive](https://github.com/awatson1978/image-link-archive) |  --- |  --- | 1.0.2.1 |
| [Stripe - Subscriptions ](https://github.com/awatson1978/payment-subscription) | [payment-subscription](https://github.com/awatson1978/payment-subscription) |  --- |  --- | 1.0 |
| [Image Link Archive](http://image-link-archive.meteor.com) | [image-link-archive](https://github.com/awatson1978/image-link-archive) | --- | --- | 1.0 |
| [Clinical Scheduling](https://clinical-scheduling.meteor.com)   | [clinical-scheduling](https://github.com/awatson1978/clinical-scheduling) | --- | --- | 1.0 |
| [Workflow Routing](http://workflow-routing.meteor.com/)  | [workflow-routing](https://github.com/awatson1978/workflow-routing) |  --- | --- | 1.0 |
| [Stripe Payments - Per Service ](http://payment-per-service.meteor.com/)  | [payment-per-service](https://github.com/awatson1978/payment-per-service) | --- | --- | 0.6.5 |
| [Stripe Payments - Crowdsourcing](https://github.com/awatson1978/payment-crowdsourcing) | [payment-crowdsourcing](https://github.com/awatson1978/payment-crowdsourcing) |  --- | --- | 0.6.5 |
| [ActiveRecord List](http://clinical-ui-crud-list.meteor.com/)      | [clinical-ui-crud-list](https://github.com/awatson1978/clinical-ui-crud-list) |  --- | --- | 0.8.0.1 |
| [Dropzone UI](https://github.com/awatson1978/dropzone-ui) | [dropzone-ui](https://github.com/awatson1978/dropzone-ui) | --- |  --- | 0.9.1 | 
| [Run Command Line Script](https://github.com/awatson1978/exec-command-line-from-ui/tree/master) | [exec-commaind-line-from-ui](https://github.com/awatson1978/exec-command-line-from-ui) |  --- | --- | 0.8.1.3 |
| [Clinical Support Forum](http://clinical-support-forum.meteor.com/) | [clinical-support-forum](https://github.com/awatson1978/clinical-support-forum) | --- | --- | 0.8.0 |
| [ActiveRecord Forms](http://clinical-ui-forms.meteor.com/)     | [clinical-ui-forms](https://github.com/awatson1978/clinical-ui-forms) | ---  | --- | 0.6.5 |
| [Drag and Drop](http://drag-and-drop.meteor.com/)        | [drag-and-drop](https://github.com/awatson1978/drag-and-drop) | ---  | --- | 0.8.0 |
| [Green Eggs and Spam](https://green-eggs-and-spam.meteor.com)        | [green-eggs-and-spam](https://github.com/awatson1978/green-eggs-and-spam) | ---  | --- | 0.8.0 |
| [Dictionary](http://dictionary.meteor.com/)             | [dictionary](https://github.com/awatson1978/dictionary) |  ---  | --- | 0.6.5 |
| [Collabtionary](http://collabtionary.meteor.com/)       | [collabtionary](https://github.com/awatson1978/collabtionary)      |  ---  | --- | 0.6.5 |
| [Hubble - CRUD & Datasets](http://hubble.meteor.com/)   | [hubble](https://github.com/awatson1978/hubble)      |  ---  | --- | 0.6.5 |

####Meteor Architecture  

![Meteor Architecture](https://raw.githubusercontent.com/awatson1978/meteor-cookbook/master/images/Meteor%20Architecture%20-%20Dev%20to%20Prod.jpg)  


========================================
#### Build A Weblog!
With version 1.0 of Meteor having been released, the Meteor Cookbook is getting a rewrite to bring all of it's examples and recipes up to 1.0 status.  The default application that all the examples build towards is creating a weblog; which can then be used as the basis of self-publishing, online journals & diaries, bulletin board systems, chat rooms, advocacy platforms, electronic medical records, personal health & fitness records, quantified-self applications, or any other application that might need a weblog.  (Edit:  the rewrite is still in progress, and all the pieces of the weblog are still being put together.  Expect a finished weblog example in mid February!)

![Weblog](https://raw.githubusercontent.com/awatson1978/meteor-cookbook/master/images/Weblog%20Wireframes.jpg)  
