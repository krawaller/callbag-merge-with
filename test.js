const test = require('tape');
const makeMockCallbag = require('callbag-mock');
const mergeWith = require('./index');

test('it merges the source with the other sources', t => {
  let history = [];
  const report = (name,dir,t,d) => t !== 0 && history.push([name,dir,t,d]);

  const source = makeMockCallbag('source', true);
  const newSource1 = makeMockCallbag('newSource1', true);
  const newSource2 = makeMockCallbag('newSource2', true);
  const sink = makeMockCallbag('sink', report);

  mergeWith(newSource1, newSource2)(source)(0, sink);

  source.emit(1, 'foo');
  newSource1.emit(1, 'bar');
  newSource2.emit(1, 'baz');

  t.deepEqual(history, [
    ['sink', 'body', 1, 'foo'],
    ['sink', 'body', 1, 'bar'],
    ['sink', 'body', 1, 'baz'],
  ], 'sink gets data from all sources');

  t.end();
});

test('the merged source terminates once all contained sources terminate', t => {
  let history = [];
  const report = (name,dir,t,d) => t !== 0 && history.push([name,dir,t,d]);

  const source = makeMockCallbag('source', true);
  const newSource1 = makeMockCallbag('newSource1', true);
  const newSource2 = makeMockCallbag('newSource2', true);
  const sink = makeMockCallbag('sink', report);

  mergeWith(newSource1, newSource2)(source)(0, sink);

  source.emit(2, 'error');
  newSource1.emit(2, 'moreError');
  newSource2.emit(1, 'data');
  newSource2.emit(2, 'finalError');

  t.deepEqual(history, [
    ['sink', 'body', 1, 'data'],
    ['sink', 'body', 2, undefined],
  ], 'sink is terminated after final source terminates');

  t.end();
});

test('a termination from sink ends all sources', t => {
  let history = [];
  const report = (name,dir,t,d) => t !== 0 && history.push([name,dir,t,d]);

  const source = makeMockCallbag('source', report, true);
  const newSource1 = makeMockCallbag('newSource1', report, true);
  const newSource2 = makeMockCallbag('newSource2', report, true);
  const sink = makeMockCallbag('sink');

  mergeWith(newSource1, newSource2)(source)(0, sink);

  sink.emit(2);

  t.deepEqual(history, [
    ['source', 'talkback', 2, undefined],
    ['newSource1', 'talkback', 2, undefined],
    ['newSource2', 'talkback', 2, undefined],
  ], 'sources all get requests from sink');

  t.end();
});
