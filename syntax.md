 
## Syntax  

I found that I spend far, far more time working about establishing the correct syntax of LESS/CSS classes, than ever worrying about MVC structure nowdays.  By doing so, you can create code like the following:

````html
<template name="userItemTemplate">
    <li class="rounded-corners user-card without-padding">
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
