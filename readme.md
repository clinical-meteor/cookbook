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
###Clinical Demos  
Links to live versions of the examples associated with this cookbook.  
 

| Live Demo     | Source|    Tests   |  Status  | Meteor Version  |
| ------------- |:----------------:| ----------------| ---------------- | ---------------:|
| [Clinical Checklists](http://clinical-checklists.meteor.com/) | [clinical-checklists](https://github.com/awatson1978/clinical-checklists) | 90+ | [![Build Status](https://travis-ci.org/awatson1978/clinical-checklists.svg?branch=master)](https://travis-ci.org/awatson1978/clinical-checklists)| 1.0.4 |
| [Clinical Trials](http://clinical-trials.meteor.com/) | [clinical-trials](https://github.com/awatson1978/clinical-trials) | 800+ | ![travis-build](https://travis-ci.org/awatson1978/clinical-trials.svg?branch=master) | 0.9.4 |
| [Clinical ActiveRecord](https://clinical-activerecord.meteor.com)  | [clinical-activerecord](https://github.com/awatson1978/clinical-activerecord) | 296 | ![travisci](https://travis-ci.org/awatson1978/clinical-activerecord.svg) |  1.0.3.1 |
| [Clinical Scheduling](https://clinical-scheduling.meteor.com)   | [clinical-scheduling](https://github.com/awatson1978/clinical-scheduling) |  7 | ![Travis Build](https://travis-ci.org/awatson1978/clinical-scheduling.svg?branch=master) | 1.0.3.1 |
| [Clinical Support Forum](http://clinical-support-forum.meteor.com/) | [clinical-support-forum](https://github.com/awatson1978/clinical-support-forum) | 7 | ![travis-build](https://travis-ci.org/awatson1978/clinical-support-forum.svg?branch=master) | 1.0.3.1 |
| [Clinical Health Planner](http://senescence.meteor.com/) | [health-planner](https://github.com/awatson1978/health-planner) | 7 | ![travis-build](https://travis-ci.org/awatson1978/health-planner.svg?branch=master) | 0.8 |
| [Clinical Workqueues](http://clinical-workqueues.meteor.com/) | [clinical-workqueues](https://github.com/awatson1978/clinical-workqueues) | 7 | ![travis-build](https://travis-ci.org/awatson1978/clinical-workqueues.svg?branch=master) | 0.6.5 |
| [Biological Reductionism](http://reductionism.meteor.com/) | [reductionism](https://github.com/awatson1978/reductionism) | 7 | ![travis-build](https://travis-ci.org/awatson1978/reductionism.svg?branch=master) | 0.7 |
| [Bioinformatics Sampler](http://reductionism.meteor.com/) | [reductionism](https://github.com/awatson1978/d3-flare-demo) | 7 | ![travis-build](https://travis-ci.org/awatson1978/d3-flare-demo.svg?branch=master) | 0.7 |

========================================
### Clinical:Meteor Packages

| Source   | Interface | Meta | Scaffold | Component | 
|:------------ | :-----------: |  :-------: | :--------: | :--------: | 
[clinical:auto-resizing](https://github.com/awatson1978/clinical-auto-resizing)  | --- | --- | --- | --- | 
[clinical:barcode](https://github.com/awatson1978/clinical-barcode)  | --- | --- | --- | --- | 
[clinical:graphs](https://github.com/awatson1978/clinical-graphs)  | bootstrap3 | --- | --- | yes | 
[clinical:hipaa-audit-log](https://github.com/awatson1978/clinical-hipaa-audit-log) |  bootstrap3 | --- | --- |yes| 
[clinical:nightwatch](https://github.com/awatson1978/clinical-nightwatch) |  bootstrap3 | --- | --- | --- | 
[clinical:nvd3](https://github.com/awatson1978/clinical-nvd3)  | --- | --- | --- | --- | 
[clinical:sidebars](https://github.com/awatson1978/clinical-ui-sidebars)  | semantic | --- | --- | yes | 
[clinical:static-pages](https://github.com/awatson1978/clinical-static-pages)  | bootstrap3 | --- | yes | --- | 
[clinical:ui-vocabulary](https://github.com/awatson1978/clinical-ui-vocabulary)  | semantic | --- | --- | --- | 
[clinical:ui-alert-panel](https://github.com/awatson1978/clinical-ui-alert-panel)  | bootstrap3 | yes | --- | yes | 
[clinical:famous-dead-people](https://github.com/awatson1978/accounts-famous-dead-people) | --- | --- | --- | --- | 



========================================
###Meteor Architecture  

![Meteor Architecture](https://raw.githubusercontent.com/awatson1978/meteor-cookbook/master/images/Meteor%20Architecture%20-%20Dev%20to%20Prod.jpg)  


========================================
###More Great Demos  


| Live Demo     | Source|    Tests   |  Status  | Meteor Version  |
| ------------- |:----------------:| ----------------| ---------------- | ---------------:|
| [iTunes Library](http://itunes.meteor.com/album/291183)  | [reactconf](https://github.com/mitar/reactconf-2015-HYPE) | --- | --- |  1.0.3.1 |





