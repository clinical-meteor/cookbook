## Natural Language Parsing  


#### Reverse Polish Notation Libraries


### Sample 1  
http://www.math.bas.bg/bantchev/place/rpn/rpn.javascript.html  
````js
function evalrpn(s)  {
  var st,tk,i,x,y,z;
  s = s.replace(/^\s*|\s*$/g,'');
  s = s.length>0 ? s.split(/\s+/) : [];
  st = [];
  for (i=0; i<s.length; ++i)  {
    tk = s[i];
    if (/^[+-]?(\.\d+|\d+(\.\d*)?)$/.test(tk))
      z = parseFloat(tk);
    else  {
      if (tk.length>1 || '+-*/'.indexOf(tk)==-1 || st.length<2)  break;
      y = st.pop();  x = st.pop();
      z = eval(x+tk+' '+y);
    }
    st.push(z);
  }
  return  i<s.length || st.length>1 ? 'error'
        : st.length==1 ? st.pop() : '';
}
````

### Sample 2   
http://kilon.org/blog/2012/06/javascript-rpn-calculator/  
````js
function rpn( input ) {
  var ar = input.split( /\s+/ ), st = [], token;
  while( token = ar.shift() ) { 
    if ( token == +token ) {
      st.push( token );
    } else {
      var n2 = st.pop(), n1 = st.pop();
      var re = /^[\+\-\/\*]$/;
      if( n1 != +n1 || n2 != +n2 || !re.test( token ) ) {
        throw new Error( 'Invalid expression: ' + input );
      }
      st.push( eval( n1 + token + ' ' + n2 ) );
    }
  }
  if( st.length !== 1 ) {
    throw new Error( 'Invalid expression: ' + input );
  }
  return st.pop();
}
````

#### Regex Patterns 

````js
db.posts.find({user_id: selectedUserId}).forEach(function(doc){

  if(/Start/.test(doc.rule)){
    // do something...
  }
  if(/Stop/.test(doc.rule)){
    // do something...
  }
  
});
````


