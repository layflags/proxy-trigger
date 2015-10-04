# proxy-trigger

[![js-standard-style](https://img.shields.io/badge/code%20style-standard-brightgreen.svg?style=flat)](https://github.com/feross/standard)

Proxies [ampersand-events](http://ampersandjs.com/docs#ampersand-events) or [Backbone.Events](http://backbonejs.org/#Events) from one emitter to another.

**A note about compatibility**

The [npm package](https://www.npmjs.com/package/proxy-trigger) should be used in an ES6 environment. Even though the published code has ES5 syntax you have to make sure to use ES5 and ES6 polyfills if you are in an ancient environment. That's why I added [core-js](https://www.npmjs.com/package/core-js) as a peer dependency.

## Install

```sh
npm install proxy-trigger
```

## Usage

```javascript
import proxyTrigger from 'proxy-trigger'

// proxy a single event
proxyTrigger(sourceEmitter, targetEmitter, 'change:title')
targetEmitter.on('change:title', () => console.log('title changed'))
sourceEmitter.trigger('change:title')
// -> title changed

// proxy multiple events with a space-separated string
proxyTrigger(sourceEmitter, targetEmitter, 'open close')

// proxy multiple events with an array of strings
proxyTrigger(sourceEmitter, targetEmitter, ['open', 'close'])

// coming soon ...

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

