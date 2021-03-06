# proxy-trigger

[![es6](https://camo.githubusercontent.com/d25414161ebfbbdd0f69a4a3e6a188a76ae2e82a/68747470733a2f2f696d672e736869656c64732e696f2f62616467652f65732d362d627269676874677265656e2e737667)](https://babeljs.io/docs/usage/polyfill/)
[![js-standard-style](https://img.shields.io/badge/code%20style-standard-brightgreen.svg?style=flat)](https://github.com/feross/standard)
[![CircleCI](https://circleci.com/gh/layflags/proxy-trigger.svg?style=svg)](https://circleci.com/gh/layflags/proxy-trigger)

Proxies [ampersand-events](http://ampersandjs.com/docs#ampersand-events) or
[Backbone.Events](http://backbonejs.org/#Events) from one emitter to another.

**A note about compatibility**

The [npm package](https://www.npmjs.com/package/proxy-trigger) should be used in
an **ES6 environment**. Even though the published code has ES5 syntax it uses
some ES6 features, so you have to make sure to use ES5 and ES6 polyfills if you
are in an ancient environment.

## Install

```sh
npm install proxy-trigger
```

## Usage

```javascript
import proxyTrigger from 'proxy-trigger'

// proxy all events by default
proxyTrigger(sourceEmitter, targetEmitter)
targetEmitter.on('foo bar', (msg) => console.log(msg))
sourceEmitter.trigger('foo', 'proxied foo')
sourceEmitter.trigger('bar', 'proxied bar')
// -> proxied foo
// -> proxied bar

// proxy a single event
proxyTrigger(sourceEmitter, targetEmitter, 'change:title')
targetEmitter.on('change:title', () => console.log('title changed'))
sourceEmitter.trigger('change:title')
// -> title changed

// proxy multiple events with a space-separated string
proxyTrigger(sourceEmitter, targetEmitter, 'open close')

// proxy multiple events with an array of strings
proxyTrigger(sourceEmitter, targetEmitter, ['open', 'close'])

// proxy events with name mapping using object notation
proxyTrigger(sourceEmitter, targetEmitter, {'change:title': 'change:source.title'})

// everything mixed
proxyTrigger(sourceEmitter, targetEmitter, [
  'open close', {'change:title': 'change:source.title'}
])
```

## Mixin usage

```javascript
import {mixin as proxyTriggerMixin} from 'proxy-trigger'
import View from 'ampersand-view'

export default View.extend(proxyTriggerMixin, {
  initialize () {
    this.proxyTrigger(this.someSubView, 'close')
  },
  ...
})
```

## Test

```sh
npm test
```

## License

[MIT](LICENSE)

