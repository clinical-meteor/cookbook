## Page Resize

#### create a window of a specific size  
````js
var w=window.open('','', 'width=100,height=100');
w.resizeTo(500,500);
````

#### prevent window resize
````js
var size = [window.width,window.height];  //public variable
$(window).resize(function(){
    window.resizeTo(size[0],size[1]);
});
````
