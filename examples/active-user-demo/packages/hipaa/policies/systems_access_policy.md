# System Access Policy

Access to Catalyze systems and application is limited for all users, including but not limited to workforce members, volunteers, business associates, contracted providers, consultants, and any other entity, is allowable only on a minimum necessary basis. All users are responsible for reporting an incident of unauthorized user or access of the organization’s information systems. These safeguards have been established to address the HIPAA Security regulations including the following:

## Applicable Standards from the HITRUST Common Security Framework

* 01.d - User Password Management
* 01.f - Password Use
* 01.r - Password Management System
* 01.a - Access Control Policy
* 01.b - User Registration
* 01.h - Clear Desk and Clear Screen Policy
* 01.j - User Authentication for External Connections
* 01.q - User Identification and Authentication
* 01.v - Information Access Restriction
* 02.i - Removal of Access Rights
* 06.e - Prevention of Misuse of Information Assets

## Applicable Standards from the HIPAA Security Rule

* 164.308a4iiC Access Establishment and Modification
* 164.308a3iiB Workforce Clearance Procedures
* 164.308a4iiB Access Authorization
* 164.312d Person or Entity Authentication
* 164.312a2i Unique User Identification
* 164.308a5iiD Password Management
* 164.312a2iii Automatic Logoff 
* 164.310b Workstation Use
* 164.310c Workstation Security
* 164.308a3iiC Termination Procedures

## Access Establishment and Modification

* Requests for access to Catalyze Platform systems and applications is made formally to the VP of Engineering, Privacy Officer, or Security Officer.
* Access is not granted until receipt, review, and approval by the Catalyze Security Officer;
* The request for access is retained for future reference.
* All access to Catalyze systems and services are reviewed and updated on an bi-annual basis to assure proper authorizations are in place commiserate with job functions. The form used to conduct account review is [here](https://docs.google.com/a/catalyze.io/forms/d/1oeejMta4XLiUsdH2gTKQ-glec6DBiwPJoY9F60HmPWk/viewform).
* Any Catalyze workforce member can request change of access using this [form](https://docs.google.com/a/catalyze.io/forms/d/1ySICzCyEEdNqxHHErjlJqREBijwxs9z72L-rWXrxkm0/viewform).
* Access to systems is controlled using centralized user management and authentication. All authentication requests utilize two factor authentication using mobile devices as the second factor.
* Temporary accounts are not used unless absolutely necessary for business purposes.
	* Accounts are reviewed every 90 days to assure temporary accounts are not left unnecessarily.
	* Accounts that are inactive for over 90 days are removed.
* In the case of non-personal information, such as generic educational content, identification and authentication may not be required. This is the responsibility of Catalyze Customers to define, and not Catalyze.
* Privileged users must first access systems using standard, unique user accounts before switching to privileged users and performing privileged tasks.
* All application to application communication using service accounts is restricted and not permitted unless absolutely needed. Automated tools are used to limit account access across applications and systems.
* Generic accounts are not allowed on Catalyze systems.
* Access is granted through encrypted, VPN tunnels.
	* VPN utilizes AES 256 bit encryption.
* In cases of increased risk or known attempted unauthorized access, immediate steps are taken by the Security and Privacy Officer to limit access and reduce risk of unauthorized access.
* Direct system to system, system to application, and application to application authentication and authorization are limited and controlled to restrict access.

## Workforce Clearance Procedures

* The level of security assigned to a user to the organization’s information systems is based on the minimum necessary amount of data access required to carry out legitimate job responsibilities assigned to a user’s job classification and/or to a user needing access to carry out treatment, payment, or healthcare operations.
* All access requests are treated on a ‘least-access principle”.
* Catalyze maintains a minimum necessary approach to access to Customer data. As such, Catalyze, including all workforce members, does not readily have access to any ePHI.

## Access Authorization

* Role based access categories for each Catalyze system and application are pre-approved by the Security Officer or VP of Engineering.
* Catalyze utilizes hardware and software firewalls to segment data, prevent unauthorized access, and monitor traffic for denial of service attacks.

## Person or Entity Authentication

* Each workforce member has and uses a unique user ID and password that identifies him/her as the user of the information system.
* Each Customer and Partner has and uses a unique user ID and password that identifies him/her as the user of the information system.

## Unique User Identification

* Access to the Catalyze Platform systems and applications is controlled by requiring unique User Login ID’s and passwords for each individual user and developer.
* Passwords requirements mandate strong password controls (see below).
* Passwords are not displayed at any time and are not transmitted or stored in plain text.
* Default accounts on all production systems, including root, are disabled.
* Shared accounts are not allowed within Catalyze systems or networks.

## Automatic Logoff

* Users are required to make information systems inaccessible by any other individual when unattended by the users (ex. by using a password protected screen saver or logging off the system).
* Information systems automatically log users off the systems after 10 minutes of inactivity.
* The Security Officer pre-approves exceptions to automatic log off requirements.

## Employee Workstation Use

All workstations at Catalyze are company owned, and all are laptop Apple products running Mac operating system.

* Workstations may not be used to engage in any activity that is illegal or is in violation of organization’s policies.
* Access may not be used for transmitting, retrieving, or storage of any communications of a discriminatory or harassing nature or materials that are obscene or “X-rated”. Harassment of any kind is prohibited. No messages with derogatory or inflammatory remarks about an individual’s race, age, disability, religion, national origin, physical attributes, sexual preference, or health condition shall be transmitted or maintained. No abusive, hostile, profane, or offensive language is to be transmitted through organization’s system.
* Information systems/applications also may not be used for any other purpose that is illegal, unethical, or against company policies or contrary to organization’s best interests. Messages containing information related to a lawsuit or investigation may not be sent without prior approval.
* Solicitation of non-company business, or any use of organization’s information systems/applications for personal gain is prohibited. 
* Transmitted messages may not contain material that criticizes organization, its providers, its employees, or others.
* Users may not misrepresent, obscure, suppress, or replace another user’s identity in transmitted or stored messages.
* Workstation hard drives will be encrypted using FileVault 2.0.
* All workstations have firewalls enabled to prevent unauthorized access unless explicitly granted.
* All workstations are to have the following messages added to the lock screen and login screen: *This computer is owned by Catalyze, Inc. By logging in, unlocking, and/or using this computer you acknowledge you have seen, and follow, these policies (https://catalyze.io/policy/) and have completed this training (https://training.catalyze.io/). Please contact us if you have problems with this - privacy@catalyze.io.*

## Wireless Access Use

* Catalyze production systems are not accessible directly over wireless channels.
* Wireless access disabled on all production systems.
* When access production systems via remote wireless connections, the same system access policies and procedures apply to wireless as all other connections, including wired.
* Wireless networks managed within Catalyze non-production facilities (offices, etc) are secured with the following configurations:
	* All data in transit over wireless is encrypted using WPA2 encryption;
	* SSIDs are not broadcast;
	* Passwords are rotated on a regular basis, presently quarterly. This process is managed by the Catalyze Security Officer.


## Employee Termination Procedures

* The Human Resources Department (or other designated department), users, and their supervisors are required to notify the Security Officer upon completion and/or termination of access needs and facilitating completion of the “Termination Checklist".
* The Human Resources Department, users, and supervisors are required to notify the IS Help Desk to terminate a user’s access rights if there is evidence or reason to believe the following (these incidents are also reported on an incident report and is filed with the Privacy Officer):
	* The user has been using their access rights inappropriately;
	* A user’s password has been compromised (a new password may be provided to the user if the user is not identified as the individual compromising the original password);
	* An unauthorized individual is utilizing a user’s User Login ID and password (a new password may be provided to the user if the user is not identified as providing the unauthorized individual with the User Login ID and password).
* The Security Officer will terminate users’ access rights immediately upon notification.
* The Security Officer audits and may terminate access of users that have not logged into organization’s information systems/applications for an extended period of time.

## Paper Records

Catalyze does not use paper records for any sensitive information. Use of paper for recording and storing sensitive data is against Catalyze policies.

## Password Management

* User IDs and passwords are used to control access to Catalyze systems and may not be disclosed to anyone for any reason.
* Users may not allow anyone, for any reason, to have access to any information system using another user’s unique user ID and password.
* On all production systems and application in the Catalyze environment, password configurations are set to require that passwords are a minimum of 8 character length, 90 day password expiration, account lockout after 5 invalid attempts, password history of last 4 passwords remembered, and account lockout after 15 minutes of inactivity.
* All system and application passwords are hashed by concatenating the user's password and a random 256-bit salt value, generated on a per-user basis, and then applying SHA-256 to the value to create a password hash. The password hash and the salt are then stored in the backend database and are used for password validation on future user authentication attempts.* Each information system automatically requires users to change passwords at a pre-determined interval as determined by the organization, based on the criticality and sensitivity of the ePHI contained within the network, system, application, and/or database.
* Passwords are inactivated immediately upon an employee’s termination (refer to the termination procedures in this policy).
* All default system, application, and Partner passwords are changed before deployment to production.
* All passwords used in configuration scripts are secured and encrypted.
* If a user believes their user ID has been compromised, they are required to immediately report the incident to the Security Office.

## PaaS Customer Access to Systems

Catalyze grants PaaS customer secure system access via VPN connections. This access is only to Customer-specific systems, no other systems in the environment. These connections are setup at customer deployment. These connections are secured and encrypted and the only method for customers to connect to Catalyze hosted systems.

In the case of data migration, Catalyze does, on a case by case basis, support customers in importing data. In these cases Catalyze support SCP assuring all data is secured and encrypted in transit.

In the case of an investigation, Catalyze will assist customers, at Catalyze's discretion, and law enforcement in forensics.

