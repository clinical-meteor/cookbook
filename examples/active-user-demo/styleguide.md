## StarryNight Style Guide  

Generally a mash up of the Meteor Style Guide and the AirBnB style guide, with a few modifications geared towards the Atom Editor (which is the officially supported editor for StarryNight and Clinical Meteor Track).

The golden rule is this:

When possible, use ``jsformat`` and ``linter-eslint`` together with the ``.meteor.eslint`` config file.  

Lets step back and explain that a bit.  JSFormat is based on JSBeautify, and is currently the most configurable code beautifier available.  It's not perfect; but it's pretty darn good and can get a close approximation of the Meteor Style Guide.  The only thing it doesn't seem to support is certain spacing patterns with regard to tokens.  

The configurations which ``jsformat``, ``linter-eslint``, and Meteor Style Guide all support get highest precedence.  After that, preference is given for configurations that ``jsformat`` and ``linter-eslint``
