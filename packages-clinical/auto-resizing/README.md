## clinical-auto-resizing

Adds resizing hooks to your application to trigger UI element resizes.  

======================================
#### Installation

````
meteor add clinical:auto-resizing
````


======================================
#### Usage

Simply put ``<div class="hidden">{{resize}}</div>`` in any template, like so:

````html
<template name="examplePage">
  <div class="hidden">{{resize}}</div>
  <div id="examplePage">
    <!-- stuff -->
  </div>
</template>
````

And then trigger it by resizing the browser, or setting the resize session variable.

````js
Session.set('resize', new Date());
````
