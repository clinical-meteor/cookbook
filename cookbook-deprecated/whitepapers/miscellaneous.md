## Miscellaneous  

These microservices don't exist in a vacuum; and even with a convention keeping the database-to-user-interface as close to a 1:1 model as possible, there is still much workflow logic to be implemented.  For instance, the ChecklistManifesto application has (approximately) the following workflow, which utilizes three microservices and two HL7 resources (List, DiagnosticOrder).

![Checklist Workflow](https://raw.githubusercontent.com/clinical-meteor/cookbook/master/images/whitepapers/redwood/ChecklistWorkflow.png)

To manage this complexity, we use two strategies: packages and Card UI design.  Packages are essentially about code reuse, and sharing modules between applications.  The Clinical Meteor track is essentially an exercise in reusing code between apps.  As such, all applications in the Clinical Meteor track and the Redwood Methodology tend towards being package-only apps.  

![Clinical Meteor Venn Diagram](https://raw.githubusercontent.com/clinical-meteor/cookbook/master/images/whitepapers/redwood/ClinicalMeteorVennDiagram.PNG)
