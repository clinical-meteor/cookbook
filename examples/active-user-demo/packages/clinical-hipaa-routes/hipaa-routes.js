// Write your package code here!
Router.route('/hipaa', {
  template: "hipaaPolicyMenu",
  name: "hipaaPolicyMenu"
});
Router.route('/hipaa/policies/3rd_party_policy', {
  template: "thirdPartyPolicy",
  name: "thirdPartyPolicy"
});
Router.route('/hipaa/policies/approved_tools_policy', {
  template: "approvedToolsPolicy",
  name: "approvedToolsPolicy"
});
Router.route('/hipaa/policies/auditing_policy', {
  template: "auditingPolicy",
  name: "auditingPolicy"
});
Router.route('/hipaa/policies/breach_policy', {
  template: "breachPolicy",
  name: "breachPolicy"
});
Router.route('/hipaa/policies/configuration_management_policy', {
  template: "configurationManagementPolicy",
  name: "configurationManagementPolicy"
});
Router.route('/hipaa/policies/data_integrity_policy', {
  template: "dataIntegrityPolicy",
  name: "dataIntegrityPolicy"
});
Router.route('/hipaa/policies/data_management_policy', {
  template: "dataManagementPolicy",
  name: "dataManagementPolicy"
});
Router.route('/hipaa/policies/data_retention_policy', {
  template: "dataRetentionPolicy",
  name: "dataRetentionPolicy"
});
Router.route('/hipaa/policies/disaster_recovery_policy', {
  template: "disasterRecoveryPolicy",
  name: "disasterRecoveryPolicy"
});
Router.route('/hipaa/policies/disposable_media_policy', {
  template: "disposableMediaPolicy",
  name: "disposableMediaPolicy"
});
Router.route('/hipaa/policies/employees_policy', {
  template: "employeesPolicy",
  name: "employeesPolicy"
});
Router.route('/hipaa/policies/facility_access_policy', {
  template: "facilityAccessPolicy",
  name: "facilityAccessPolicy"
});
Router.route('/hipaa/policies/hipaa_business_associate_agreement', {
  template: "hipaaBusinessAssociateAgreement",
  name: "hipaaBusinessAssociateAgreement"
});
Router.route('/hipaa/policies/intrusion_detection_policy', {
  template: "intrusionDetectionPolicy",
  name: "intrusionDetectionPolicy"
});
Router.route('/hipaa/policies/incident_response_policy', {
  template: "incidentResponsePolicy",
  name: "incidentResponsePolicy"
});
Router.route('/hipaa/policies/key_definitions', {
  template: "keyDefinitions",
  name: "keyDefinitions"
});
Router.route('/hipaa/policies/policy_management_policy', {
  template: "policyManagementPolicy",
  name: "policyManagementPolicy"
});
Router.route('/hipaa/policies/risk_management_policy', {
  template: "riskManagementPolicy",
  name: "riskManagementPolicy"
});
Router.route('/hipaa/policies/roles_policy', {
  template: "rolesPolicy",
  name: "rolesPolicy"
});
Router.route('/hipaa/policies/systems_access_policy', {
  template: "systemAccessPolicy",
  name: "systemAccessPolicy"
});
Router.route('/hipaa/policies/vulnerability_scanning_policy', {
  template: "vulnerabilityScanningPolicy",
  name: "vulnerabilityScanningPolicy"
});
