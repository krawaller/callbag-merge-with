# callbag-merge-with

[Callbag](https://github.com/callbag/callbag) operator version of [callback-merge](https://github.com/staltz/callbag-merge). Useful for example when you want to merge the current source with other(s) in the middle of a pipe.

`npm install callbag-merge-with`

## example

```js
const fromEvent = require('callbag-from-event');
const pipe = require('callbag-pipe');
const filter = require('callbag-filter');
const mergeWith = require('callbag-merge-with');
const mapTo = require('callbag-map-to');

const submitActions = pipe(
  fromEvent(inputNode, 'keyup'),
  filter(e => e.key === 'Enter'),
  mergeWith(fromEvent(submitBtn, 'click')),
  mapTo({type: 'submit'})
);
```
