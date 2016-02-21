Clinical Meteor API Design Style Guide


Political Correctness Cartoon
https://img.washingtonpost.com/wp-apps/imrs.php?src=https://img.washingtonpost.com/news/opinions/wp-content/uploads/sites/10/2016/01/toles01062016.jpg&w=1484

Some General Comments
- This is not tone policing.  People can use whatever language they want in their projects; and publish packages with whatever names they want. 
- The problem is when questionable language creeps into APIs, guides, tutorials, and other training/reference materials.
- This is a style guide for the Clinical Meteor release track.  Since we’re releasing our own distro instead of tone policing; we have the luxury of setting a standard that meet’s the healthcare industry’s standards.  
- As a federally regulated industry, subject to regulatory overview such as HIPAA, FDA, CLIA, CHHIT, etc, most organizations that are interested in an HIPAA and FDA compliant version of Meteor will also be subject to the Federal Employment Non-Discrimination Act.  
- In healthcare we perform prostate exams, mammograms, collect stool samples, perform enemas, match in-vitro fertilization surrogates to sperm donors, perform obstetric sonograms, treat erectile dysfunction disorders, and collect patient-satisfaction surveys.  So in addition to ENDA requirements, we have additional  stringent requirements for API design as they might relate to sexual innuendo, sexual slurs, and the like.
- If you wish to create your own distro and API, you can choose what language to put into it.  Feel free to make a vulgar meteor distro if you so wish.  Make a porn API.  Whatever.  We really don’t care.  
- We only care about what winds up going into official documentation that may wind up affecting our industry.  We are legally compelled to do so.
- This is API design for inclusivity.  Which means lowest-common denominator.
- This is not singling out a specific issue.  We’re concerned about getting and retaining whatever talent we can, which means casting a broad net.  We’re equally concerned about racial/ethnic slurs as sexist slurs.
- Our criticism spans different technologies.  Mongo, React, Meteor, Velocity… we have problems with language that’s found it’s way into each technology’s APIs.  We look at IBM, Microsoft, and Google as particularly well crafted APIs which we’re emulating.  
- Improper language tends to get flagged in four different scenarios:  sales process, audits, training, and emails forwarded to HR departments.  
- We’re equal-opportunity in our scrubbing.  We’ve scrubbed inappropriate language from APIs delivered by major corporations and community driven projects alike; from both men and women developers.  

The Golden Rule of Sexual Harassing Language
- If it can be construed as a sexual innuendo, it will be.  

Review an API Before Publishing
- Vulgar language is easy to identify; harassing language and micro aggressions are more difficult.  So a lowest-common-denominator is used.
- As an API designer and package publisher, it’s your responsibility to think about how APIs will get used.
- Check the urban dictionary before publishing a package or API.

Exclusion List
To date, the following terms have been explicitly flagged and have been scrubbed from the Clinical Meteor project.  

- master/slave (harassing racial language)
- cucumber/jasmine (sexual innuendo when paired together)
- spy/mock (harassing language)
- shim (sexual slur used in hate crimes)
- mounting (unnecessary sexual innuendo)
- dirty underpants (needlessly graphic)

This list will be expanded with any additional language or syntax that makes it’s way into officially sanctioned projects, guides, tutorials, etc.  We will be forking and cleaning the API as necessary.  
