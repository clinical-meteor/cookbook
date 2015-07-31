Tinytest.add('session - toggle()', function (test) {
  Session.setDefault('foo', true);
  test.equal(Session.get('foo'), true);
  Session.set('foo', false);
  test.equal(Session.get('foo'), false);
  Session.set('foo', true);

  Session.toggle('foo');
  test.equal(Session.get('foo'), false);

  Session.toggle('foo');
  test.equal(Session.get('foo'), true);

// This is so the test passes the next time, after hot code push.  I know it
  // doesn't return it to the completely untouched state, but we don't have
  // Session.clear() yet.  When we do, this should be that.
  delete Session.keys['foo'];
});

Tinytest.add('session - clear()', function (test) {
  Session.set('bar', 'zip');
  test.equal(Session.get('bar'), 'zip');

  Session.set('bar', false);
  test.equal(Session.get('bar'), false);

  Session.clear('bar');
  test.equal(Session.get('bar'), null);

  delete Session.keys['foo'];
});


Tinytest.add('session - setAll()', function (test) {
  Session.setAll({fruit: 'apple', vegetable: 'potato'});

  test.equal(Session.get('fruit'), 'apple');
  test.equal(Session.get('vegetable'), 'potato');

  delete Session.keys['fruit'];
  delete Session.keys['vegetable'];
});
