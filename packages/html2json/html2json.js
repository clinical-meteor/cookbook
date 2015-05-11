// https://github.com/Jxck/html2json

function parseHtml(html) {
  var results = '';
  HTMLParser(html, {
    start: function(tag, attrs, unary) {
      results += '<' + tag;
      for (var i = 0; i < attrs.length; i++) {
        results += ' ' + attrs[i].name + '="' + attrs[i].escaped + '"';
      }
      results += (unary ? '/' : '') + '>';
    },
    end: function(tag) {
      results += '</' + tag + '>';
    },
    chars: function(text) {
      results += text;
    },
    comment: function(text) {
      results += '<!--' + text + '-->';
    }
  });
  return results;
}

function makeMap(str) {
  var obj = {}, items = str.split(',');
  for (var i = 0; i < items.length; i++) {
    obj[items[i]] = true;
  }
  return obj;
}

function html2json(html) {
  // Inline Elements - HTML 4.01
  var inline = makeMap('a,abbr,acronym,applet,b,basefont,bdo,big,br,button,cite,code,del,dfn,em,font,i,iframe,img,input,ins,kbd,label,map,object,q,s,samp,script,select,small,span,strike,strong,sub,sup,textarea,tt,u,var');
  // but I want to handle some tag like block tag
  inline.textarea = false;
  inline.input = false;
  inline.img = false;

  html = html.replace(/<!DOCTYPE[\s\S]+?>/, '');

  var bufArray = [];
  var results = {};
  var inlineBuf = [];
  bufArray.last = function() {
    return this[ this.length - 1];
  };
  HTMLParser(html, {
    start: function(tag, attrs, unary) {
      if (inline[tag]) {
        // inline tag is melted into text
        // because syntacs higlight became dirty
        // if support it.
        // 'hoge <inline>tag</inline> fuga'
        var attributes = '';
        for (var i = 0; i < attrs.length; i++) {
          attributes += ' ' + attrs[i].name + '="' + attrs[i].value + '"';
        }
        inlineBuf.push('<' + tag + attributes + '>');
      } else {
        var buf = {}; // buffer for single tag
        buf.tag = tag;
        if (attrs.length !== 0) {
          var attr = {};
          for (var i = 0; i < attrs.length; i++) {
            var attr_name = attrs[i].name;
            var attr_value = attrs[i].value;
            if (attr_name === 'class') {
              attr_value = attr_value.split(' ');
            }
            attr[attr_name] = attr_value;
          }
          buf['attr'] = attr;
        }
        if (unary) {
          // if this tag don't has end tag
          // like <img src="hoge.png"/>
          // add last parents
          var last = bufArray.last();
          if (!(last.child instanceof Array)) {
            last.child = [];
          }
          last.child.push(buf);
        } else {
          bufArray.push(buf);
        }
      }
    },
    end: function(tag) {
      if (inline[tag]) {
        // if end of inline tag
        // inlineBuf is now '<inline>tag'
        // melt into last node text
        var last = bufArray.last();
        inlineBuf.push('</' + tag + '>');
        // inlineBuf became '<inline>tag</inline>'
        if (!last.text) last.text = '';
        last.text += inlineBuf.join('');
        // clear inlineBuf
        inlineBuf = [];
      } else {
        // if block tag
        var buf = bufArray.pop();
        if (bufArray.length === 0) {
          return results = buf;
        }
        var last = bufArray.last();
        if (!(last.child instanceof Array)) {
          last.child = [];
        }
        last.child.push(buf);
      }
    },
    chars: function(text) {
      if (inlineBuf.length !== 0) {
        // if inlineBuf exists
        // this cace inlineBuf is maybe like this
        // 'hoge <inline>tag</inline>'
        // so append to last
        inlineBuf.push(text);
      } else {
        var last = bufArray.last();
        if (last) {
          if (!last.text) {
            last.text = '';
          }
          last.text += text;
        }
      }
    },
    comment: function(text) {
      // results += "<!--" + text + "-->";
    }
  });
  return results;
}

function json2html(json) {
  var html = '';
  var tag = json.tag;
  var text = json.text;
  var children = json.child;
  var buf = [];

  // Empty Elements - HTML 4.01
  var empty = makeMap('area,base,basefont,br,col,frame,hr,img,input,isindex,link,meta,param,embed');

  var buildAttr = function(attr) {
    for (var k in attr) {
      buf.push(' ' + k + '="');
      if (attr[k] instanceof Array) {
        buf.push(attr[k].join(' '));
      } else {
        buf.push(attr[k]);
      }
      buf.push('"');
    }
  }

  buf.push('<');
  buf.push(tag);
  json.attr ? buf.push(buildAttr(json.attr)) : null;
  if (empty[tag]) buf.push('/');
  buf.push('>');
  text ? buf.push(text) : null;
  if (children) {
    for (var j = 0; j < children.length; j++) {
      buf.push(json2html(children[j]));
    }
  }
  if (!empty[tag]) buf.push('</' + tag + '>');
  return buf.join('');
}
