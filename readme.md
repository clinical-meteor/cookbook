##Meteor Cookbook  

Hi.  Welcome to the Meteor Cookbook; a FAQ and tutorial culled and curated from over 2 years of emails and discussions from the [meteor] google group and my experiences rolling out packages and apps.  These documents are intended for the intermediate user learning Meteor, who is accustomed to a) object-oriented frameworks and languages, such as Java and C#, and b) relational databases and data structures derived from SQL table schemas.  The focus is on helping the user grow accustomed to functional programming using document oriented databases.  


========================================
###[TABLE OF CONTENTS](https://github.com/awatson1978/meteor-cookbook/blob/master/table-of-contents.md)  



========================================
###Applet Demos  
Links to live versions of the examples associated with this cookbook.  
 

| Live Demo     | Source|    Tests   |  Status  | Meteor Version  |
| ------------- |:----------------:| ----------------| ---------------- | ---------------:|
| [Panel Layout](https://panel-layout.meteor.com)  | [panel-layout](https://github.com/awatson1978/panel-layout) | 24 | ![travis-build](https://travis-ci.org/awatson1978/panel-layout.svg?branch=master)   |  1.0.3.1 |
| [Minimongo Table](https://minimongo-table.meteor.com)  | [minimongo-table](https://github.com/awatson1978/minimongo-table) | 78 | ![travisci](https://travis-ci.org/awatson1978/minimongo-table.svg) |  1.0.3.1 |
| [REST API](http://rest-api.meteor.com/)  | [rest-api](https://github.com/awatson1978/rest-api) | 10 | ![travisci](https://travis-ci.org/awatson1978/rest-api.svg?branch=master) | 1.0.3.1 |
| [Rest Analytics Pipeline](http://rest-analytics-pipeline.meteor.com/)      | [rest-analytics-pipeline](https://github.com/awatson1978/rest-analytics-pipeline) | 52 | ![travis-build](https://travis-ci.org/awatson1978/rest-analytics-pipeline.svg?branch=master) | 1.0.3.1 |
| [Fonts & Calligraphy](http://fonts.meteor.com/)   | [fonts-site](https://github.com/awatson1978/fonts-site) |  15  | ![travisci](https://travis-ci.org/awatson1978/fonts-site.svg?branch=master) | 1.0.3.1 |
| [Geolocated Parties](https://github.com/awatson1978/leaflet-parties)   | [leaflet-parties](https://github.com/awatson1978/leaflet-parties) | 8 | ![travis-build](https://travis-ci.org/awatson1978/leaflet-parties.svg?branch=master) | 1.0.3.1 |
| [Stripe - Subscriptions ](https://github.com/awatson1978/payment-subscription) | [payment-subscription](https://github.com/awatson1978/payment-subscription) |  7 |  ![travis-build](https://travis-ci.org/awatson1978/payment-subscription.svg?branch=master) | 1.0.3.1 |
| [Medical Illustration Library](http://image-link-archive.meteor.com) | [image-link-archive](https://github.com/awatson1978/image-link-archive) | 7 | ![travis-build](https://travis-ci.org/awatson1978/image-link-archive.svg?branch=master) | 1.0.3.1 |
| [Workflow Routing](http://workflow-routing.meteor.com/)  | [workflow-routing](https://github.com/awatson1978/workflow-routing) |  7 | ![travis-build](https://travis-ci.org/awatson1978/workflow-routing.svg?branch=master) | 1.0.3.1 |
| [Weblog](http://clinical-ui-crud-list.meteor.com/)      | [clinical-weblog](https://github.com/awatson1978/clinical-ui-crud-list) |  7 | ![travis-build](https://travis-ci.org/awatson1978/clinical-weblog.svg?branch=master) | 1.0.3.1 |
| [Dropzone UI](https://github.com/awatson1978/dropzone-ui) | [dropzone-ui](https://github.com/awatson1978/dropzone-ui) | 7 |  ![travis-build](https://travis-ci.org/awatson1978/dropzone-ui.svg?branch=master) | 1.0.3.1 | 
| [Drag and Drop](http://drag-and-drop.meteor.com/)        | [drag-and-drop](https://github.com/awatson1978/drag-and-drop) | 7 | ![travis-build](https://travis-ci.org/awatson1978/drag-and-drop.svg?branch=master) | 1.0.3.1 |
| [Green Eggs and Spam](https://green-eggs-and-spam.meteor.com)        | [green-eggs-and-spam](https://github.com/awatson1978/green-eggs-and-spam) | 7  | ![travis-build](https://travis-ci.org/awatson1978/green-eggs-and-spam.svg?branch=master) | 1.0.3.1 |
| [Stripe - Per Service ](http://payment-per-service.meteor.com/)  | [payment-per-service](https://github.com/awatson1978/payment-per-service) | 7 | ![travis-build](https://travis-ci.org/awatson1978/payment-per-service.svg?branch=master) | 1.0.3.1 |
| [Stripe - Crowdsourcing](https://github.com/awatson1978/payment-crowdsourcing) | [payment-crowdsourcing](https://github.com/awatson1978/payment-crowdsourcing) |  7 | ![travis-build](https://travis-ci.org/awatson1978/payment-crowdsourcing.svg?branch=master) | 1.0.3.1 |
| [ActiveRecord Forms](http://clinical-ui-forms.meteor.com/)     | [clinical-ui-forms](https://github.com/awatson1978/clinical-ui-forms) | 7  | ![travis-build](https://travis-ci.org/awatson1978/clinical-ui-forms.svg?branch=master) | 0.6.5 |
| [Dictionary](http://dictionary.meteor.com/)             | [dictionary](https://github.com/awatson1978/dictionary) |  7  | ![travis-build](https://travis-ci.org/awatson1978/dictionary.svg?branch=master) | 0.6.5 |
| [Collabtionary](http://collabtionary.meteor.com/)       | [collabtionary](https://github.com/awatson1978/collabtionary)      |  7  | ![travis-build](https://travis-ci.org/awatson1978/collabtionary.svg?branch=master) | 0.6.5 |
| [Hubble (Datasets Demo)](http://hubble.meteor.com/)   | [hubble](https://github.com/awatson1978/hubble)      |  7  | ![travis-build](https://travis-ci.org/awatson1978/hubble.svg?branch=master) | 1.0.3.1 |
| [Run Command Line Script](https://github.com/awatson1978/exec-command-line-from-ui/tree/master) | [exec-commaind-line-from-ui](https://github.com/awatson1978/exec-command-line-from-ui) |  7 | ![travis-build](https://travis-ci.org/awatson1978/exec-command-line-from-ui.svg?branch=master) | 1.0.3.1 |



========================================
###Clinical Meteor Track  

If you'd like to learn more, check out the Clinical Meteor Track project...  a version of Meteor designed for biomedical, clinical, and healthcare applications.  Check out the project page to learn more, and be aware that these two projects are being run in parallel.  

http://clinical.meteor.com/


========================================
###Meteor Architecture  

![Meteor Architecture](https://raw.githubusercontent.com/awatson1978/meteor-cookbook/master/images/Meteor%20Architecture%20-%20Dev%20to%20Prod.jpg)  


========================================
###More Great Demos  


| Live Demo     | Source|    Tests   |  Status  | Meteor Version  |
| ------------- |:----------------:| ----------------| ---------------- | ---------------:|
| [iTunes Library](http://itunes.meteor.com/album/291183)  | [reactconf](https://github.com/mitar/reactconf-2015-HYPE) | --- | --- |  1.0.3.1 |





