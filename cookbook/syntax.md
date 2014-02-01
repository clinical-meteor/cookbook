## Syntax  
**- the arrangement of words and phrases to create well-formed sentences in a language.**    

Language syntax doesn't have to be hard.  But somehow it often is.  Meteor makes language syntax a breeze, if you're willing to use a few particular patterns.  

####Semantic HTML
Keep in mind that Meteor supports HTML5, which includes all of the following structural tags.  

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
    
And there are also the folowing Media Tags.
    
    <video>
    <audio>
    <source>
    <track>
    <embed>
    <canvas>
    <svg>
    
[Semantic HTML](http://www.w3schools.com/html/html5_semantic_elements.asp)




````html
<template name="userItemTemplate">
    <li class="user-card with rounded-corners without-padding">
        <img class="card-image with gray-border" src="{{ userImage }}" />
        <div class="card-data">
            <div class="card-northwest gray card-meta-data without-padding barcode">*{{ _id }}*</div>
            <div class="card-northwest-secondary user-email bold">{{ userName }}</div>
            <ul class="card-southeast pictograph-buttons">
                <li class="{{isActiveCollaborator}} largish transfer-icon pictograph">o</li>
                <li class="{{isCollaborator}} largish collaborator-icon pictograph">a</li>
                <li class="{{isCarewatched}} largish carewatch-icon pictograph">j</li>
            </ul>
        </div>
    </li>
</template>
````

And once you get to larger applications, that kind of syntax will be not just invaluable, it will be essential, to managing application complexity.  Note how the classes are bordering on being pseudo-english sentences.  If you can structure your css/less classes in that manner, you'll be able to offload commonly used functionality to hardware accelerated code, manage it with dependencies and includes/imports, and keep your application syntax super easy to read and maintain.   


#### Semantic Libraries  
At the very least, get yourself a UI kit, such as Bootstrap 3 or Zurb Foundation.  All the examples in the Meteor Cookbook use Bootstrap 3.  However, in the future, we're considering moving to something even more semantic, such as Semantic UI.  

[Bootstrap](http://getbootstrap.com/)  
[Semantic UI](http://semantic-ui.com/)  

