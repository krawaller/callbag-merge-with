const test = require('tape');
const makeMockCallbag = require('callbag-mock');
const mergeWith = require('./index');

test('it merges the source with the other sources', t => {
  const source = makeMockCallbag(true);
  const newSource1 = makeMockCallbag(true);
  const newSource2 = makeMockCallbag(true);
  const sink = makeMockCallbag();

  mergeWith(newSource1, newSource2)(source)(0, sink);

  source.emit(1, 'foo');
  newSource1.emit(1, 'bar');
  newSource2.emit(1, 'baz');

  t.deepEqual(
    sink.getReceivedData(),
    ['foo','bar','baz'],
    'sink gets data from all sources'
  );
  t.end();
});

test('the merged source terminates once all contained sources terminate', t => {
  const source = makeMockCallbag(true);
  const newSource1 = makeMockCallbag(true);
  const newSource2 = makeMockCallbag(true);
  const sink = makeMockCallbag();

  mergeWith(newSource1, newSource2)(source)(0, sink);

  source.emit(2);
  t.ok(sink.checkConnection(), 'sink is still connected when 1/3 sources are terminated');
  newSource1.emit(2, 'moreError');
  t.ok(sink.checkConnection(), 'sink is still connected when 2/3 sources are terminated');
  newSource2.emit(2, 'finalError');
  t.ok(!sink.checkConnection(), 'sink is terminated when no sources remain');
  t.end();
});

test('a termination from sink ends all sources', t => {
  const source = makeMockCallbag(true);
  const newSource1 = makeMockCallbag(true);
  const newSource2 = makeMockCallbag(true);
  const sink = makeMockCallbag();

  mergeWith(newSource1, newSource2)(source)(0, sink);

  sink.emit(2);

  t.ok(
    !source.checkConnection() && !newSource1.checkConnection() && !newSource2.checkConnection(),
    'all sources are terminated by sink'
  );
  t.end();
});
