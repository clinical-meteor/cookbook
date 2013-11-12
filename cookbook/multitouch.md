**Q:  There are weird blue artifacts when using touch monitors.  How do I get rid of them?**  
The tap events don't handle :hover pseudoclasses very well.  Trying sprinkling your application with the following CSS class:

````
.unselectable{
  -moz-user-select: none;
  -khtml-user-select: none;
  -webkit-user-select: none;
  user-select: none;
}
````
