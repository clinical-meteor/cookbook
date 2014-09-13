File Uploads  
========================================

Uploading files can be easy or really complicated, depending on what you're wanting to do.  In general, transfering a file itself isn't all that difficult.  But there are lots of edge cases around attachments, binary files, and the like.  And the real sticking point is horizontal scaling, and creating a solution that works when the server is cloned a second, third, and nth time.  



---------------------------------------
#### Server/Client

Let's start with a basic server/client upload model.  We begin by adding a file input element to the document object model.  
````html
<!-- client/example.html -->
<template name="example">
  <input type=file />
</template>
````

Then attach an event to the input element within your controller, and call a local Meteor method ``startFileTransfer'' to initiate the transfer.
````js
// client/example.js
Template.example.events({
  'change input': function(ev) {  
    _.each(ev.srcElement.files, function(file) {
      Meteor.startFileTransfer(file, file.name);
    });
  }
});

// client/save.js
/**
 * @blob (https://developer.mozilla.org/en-US/docs/DOM/Blob)
 * @name the file's name
 * @type the file's type: binary, text (https://developer.mozilla.org/en-US/docs/DOM/FileReader#Methods) 
 *
 * TODO Support other encodings: https://developer.mozilla.org/en-US/docs/DOM/FileReader#Methods
 * ArrayBuffer / DataURL (base64)
 */
Meteor.startFileTransfer = function(blob, name, path, type, callback) {
  var fileReader = new FileReader(),
    method, encoding = 'binary', type = type || 'binary';
  switch (type) {
    case 'text':
      // TODO Is this needed? If we're uploading content from file, yes, but if it's from an input/textarea I think not...
      method = 'readAsText';
      encoding = 'utf8';
      break;
    case 'binary': 
      method = 'readAsBinaryString';
      encoding = 'binary';
      break;
    default:
      method = 'readAsBinaryString';
      encoding = 'binary';
      break;
  }
  fileReader.onload = function(file) {
    Meteor.call('saveFileToDisk', file.srcElement.result, name, path, encoding, callback);
  }
  fileReader[method](blob);
}

````

The client will then call the ``saveFileToDisk`` server method, which does the actual transfer and puts everything to disk.  
````js
// 
/**
 * TODO support other encodings:
 * http://stackoverflow.com/questions/7329128/how-to-write-binary-data-to-a-file-using-node-js
 */
Meteor.methods({
  saveFileToDisk: function(blob, name, path, encoding) {
    var path = cleanPath(path), fs = __meteor_bootstrap__.require('fs'),
      name = cleanName(name || 'file'), encoding = encoding || 'binary',
      chroot = Meteor.chroot || 'public';
    // Clean up the path. Remove any initial and final '/' -we prefix them-,
    // any sort of attempt to go to the parent directory '..' and any empty directories in
    // between '/////' - which may happen after removing '..'
    path = chroot + (path ? '/' + path + '/' : '/');
    
    // TODO Add file existance checks, etc...
    fs.writeFile(path + name, blob, encoding, function(err) {
      if (err) {
        throw (new Meteor.Error(500, 'Failed to save file.', err));
      } else {
        console.log('The file ' + name + ' (' + encoding + ') was saved to ' + path);
      }
    }); 
 
    function cleanPath(str) {
      if (str) {
        return str.replace(/\.\./g,'').replace(/\/+/g,'').
          replace(/^\/+/,'').replace(/\/+$/,'');
      }
    }
    function cleanName(str) {
      return str.replace(/\.\./g,'').replace(/\//g,'');
    }
  }
});
````



---------------------------------------
#### Dropzone 


**[Cookbook Example:  Dropzone UI](https://github.com/awatson1978/dropzone-ui)**  

````sh
  meteor add iron:router
  meteor add awatson1978:dropzone
````

````html
  {{> dropzone url="/uploads" id="#creativeTagDropZone" }}
````

````js
Router.map(function () {
    this.route('uploads', {
      where: 'server',
      action: function () {
        var fs = Npm.require('fs');
        var path = Npm.require('path');
        var self = this;

        ROOT_APP_PATH = fs.realpathSync('.');

        // dropzone.js stores the uploaded file in the /tmp directory, which we access
        fs.readFile(self.request.files.file.path, function (err, data) {

          // and then write the file to the uploads directory
          fs.writeFile(ROOT_APP_PATH + "/assets/app/uploads/" +self.request.files.file.name, data, 'binary', function (error, result) {
            if(error){
              console.error(error);
            }
            if(result){
              console.log('Success! ', result);
            }
          });
        });
      }
    });
  });
````



---------------------------------------
#### Filepicker.io  


---------------------------------------
#### CollectionFS    


---------------------------------------
#### Additional References  

[Dario's Save File Pattern](https://gist.github.com/dariocravero/3922137)  
[Micha Roon's File Upload Pattern](https://coderwall.com/p/7tpa8w)  
[EventedMind File Upload Package](https://www.eventedmind.com/feed/meteor-build-a-file-upload-package)  


