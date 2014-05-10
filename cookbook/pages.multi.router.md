##Multi Page Example With Routing

##### The Document Object Model 

````html
<!-- /client/models/page.home.html -->
<template name="homePage">
  <div id="homePage" class="{{pageVisibility}} page">
    <h2>{{ getTitle }}<h2>
    <p class="tagline">{{ getText }}<p>
    <!-- insert home page content here-->
  </div>
</template>

<!-- /client/models/page.about.html -->
<template name="aboutPage">
  <div id="aboutPage" class="{{pageVisibility}} page">
    <h2>{{ getTitle }}<h2>
    <p class="tagline">{{ getText }}<p>
    <!-- insert about page content here-->
  </div>
</template>
````


####Using Iron Router and onRun 

```
this.route('homePage', {
	path: '/',
	onRun: function() {
		return Session.set('active_page', 'homePage');
	}
});

this.route('aboutPage', {
	path: 'about',
	onRun: function() {
		return Session.set('active_Page', 'aboutPage');
	}
)};
```