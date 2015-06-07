## Sublime IDE

#### Links, Installation


#### Implementing Meteor Styleguide
https://github.com/meteor/meteor/dwiki/Meteor-Style-Guide  


#### MVC Color Coding


#### Settings > Code Style > Javascript
As per the Meteor style guide.  
https://github.com/meteor/meteor/wiki/Meteor-Style-Guide  


#### Preference > Settings User  
````js
// folder_exclude_patterns and file_exclude_patterns control which files
// are listed in folders on the side bar. These can also be set on a per-
// project basis.
"folder_exclude_patterns": [".svn", ".git", ".hg", "CVS"],
````

#### Install the Sublime Package Manager  
https://sublime.wbond.net/installation#st2  

Press ``ctrl-```, or ``View > Show Console``, and then cut and paste the code for your version of Sublime Text Editor.    
````python
# Sublime Text 2
import urllib2,os; pf='Package Control.sublime-package'; ipp = sublime.installed_packages_path(); os.makedirs( ipp ) if not os.path.exists(ipp) else None; urllib2.install_opener( urllib2.build_opener( urllib2.ProxyHandler( ))); open( os.path.join( ipp, pf), 'wb' ).write( urllib2.urlopen( 'http://sublime.wbond.net/' +pf.replace( ' ','%20' )).read()); print( 'Please restart Sublime Text to finish installation')
````

### JS Beutify Config

````js
{
  // Details: https://github.com/victorporof/Sublime-HTMLPrettify#using-your-own-jsbeautifyrc-options
  // Documentation: https://github.com/einars/js-beautify/
  "html": {
    "brace_style": "collapse", // "expand", "end-expand", "expand-strict"
    "indent_char": " ",
    "indent_scripts": "keep", // "separate", "normal"
    "indent_size": 2,
    "max_preserve_newlines": 10,
    "preserve_newlines": true,
    "unformatted": ["a", "sub", "sup", "b", "i", "u"],
    "wrap_line_length": 0
  },
  "css": {
    "indent_char": " ",
    "indent_size": 2
  },
  "js": {
    "brace_style": "end-expand", // "expand", "end-expand", "expand-strict"
    "break_chained_methods": false,
    "e4x": false,
    "eval_code": false,
    "indent_char": " ",
    "indent_level": 0,
    "indent_size": 2,
    "indent_with_tabs": false,
    "jslint_happy": true,
    "keep_array_indentation": false,
    "keep_function_indentation": false,
    "max_preserve_newlines": 10,
    "preserve_newlines": true,
    "space_before_conditional": true,
    "space_in_paren": false,
    "space_after_anon_function": true
    "unescape_strings": false,
    "wrap_line_length": 80
  }
}

````

### Settings > Directories > Excluded
You want to exclude the ``.meteor`` file so that the Meteor build process doesn't crash your IDE.  
````
.idea
.meteor
````


