## Syntax  

Language syntax doesn't have to be hard.  But somehow it often is.  Meteor makes language syntax a breeze, if you're willing to use a few particular patterns.  

####Semantic HTML in Meteor
Meteor introduces the ``<template>`` tag, and supports [HTML5](http://www.w3schools.com/html/html5_semantic_elements.asp), which includes [all of the following structural tags](http://www.w3schools.com/tags/default.asp).

    <template>
    <header>
    <nav>
    <section>
    <article>
    <aside>
    <figure>
    <figcaption>
    <footer>
    <details>
    <summary>
    <mark>
    <time>
    <dialog>
    <command>
    <meter>
    <progress>
    <canvas>
    <video>
    <audio>
    <embed>
    <svg>
    
These should all be valid tags in your application.  The more you use them, the cleaner and more concise your application will be.  

But, eventually, you'll want to start extending those tags with classes.  How you go about doing that can dramatically affect how well your program runs, and how easy it is to implement new features. Suffice it to say that it drastically helps to keep your code as semantic as possible.  Ideally, you'll find yourself writing code similar to the following, or better.

````html
<template name="userItemTemplate">
    <li class="user-card with rounded-corners without-padding">
        <img class="card-image with gray-border" src="{{ userImage }}" />
        <div class="card-data">
            <div class="gray card-meta-data barcode without-padding">*{{ _id }}*</div>
            <div class="card-title user-email bold">{{ userName }}</div>
            <ul class="card-control pictograph-buttons">
                <li class="{{isActiveCollaborator}} largish transfer-icon pictograph">o</li>
                <li class="{{isCollaborator}} largish collaborator-icon pictograph">a</li>
                <li class="{{isCarewatched}} largish carewatch-icon pictograph">j</li>
            </ul>
        </div>
    </li>
</template>
````

If you can structure your css/less classes in this manner, you'll be able to offload commonly used functionality to hardware accelerated code, manage it with dependencies and includes/imports, and keep your application syntax super easy to read and maintain.   


#### Semantic Libraries  
At the very least, consider a semantic UI library of some sort, such as Bootstrap 3 or Zurb Foundation (they're the oldest, and have been around the longest).  All the examples in the Meteor Cookbook use Bootstrap 3.  However, in the future, we're considering moving to something even more semantic, such as Semantic UI.  

[Bootstrap](http://getbootstrap.com/)  
[Semantic UI](http://semantic-ui.com/)  

You can install either of these packages with the following commands:

````sh
sudo mrt add bootstrap-3
sudo mrt add semantic-ui
````

You can also find related packages on Atmosphere:  
[Bootstrap-3 packages on Atmosphere](http://atmospherejs.com/?q=bootstrap)  
[Semantic UI packages on Atmosphere](http://atmospherejs.com/?q=semantic)  
