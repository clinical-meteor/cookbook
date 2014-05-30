## Regexes  

[8 Regular Expressions You Should Know](http://code.tutsplus.com/tutorials/8-regular-expressions-you-should-know--net-6149)  

````js

// matching a username
/^[a-z0-9_-]{3,16}$/

// matching a password
/^[a-z0-9_-]{6,18}$/

// matching a hex value
/^#?([a-f0-9]{6}|[a-f0-9]{3})$/

// matching a slug
/^[a-z0-9-]+$/

// matching an email
/^([a-z0-9_\.-]+)@([\da-z\.-]+)\.([a-z\.]{2,6})$/

// matching a url
/^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/

// matching an ip address
/^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/

// matching an html tag
/^<([a-z]+)([^<]+)*(?:>(.*)<\/\1>|\s+\/>)$/




````


