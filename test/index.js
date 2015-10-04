import test from 'tape'
import proxyTrigger, {mixin as proxyTriggerMixin} from '../src/proxy-trigger'
import Events from 'ampersand-events'

function setup (cb) {
  const sourceEmitter = Events.createEmitter()
  const targetEmitter = Events.createEmitter()

  cb(sourceEmitter, targetEmitter)

  sourceEmitter.stopListening()
  sourceEmitter.off()
  targetEmitter.stopListening()
  targetEmitter.off()
}

function fooBarBaz (events, t) {
  setup((sourceEmitter, targetEmitter) => {
    proxyTrigger(sourceEmitter, targetEmitter, events)
    targetEmitter.on('foo bar baz', (info) => t.ok(true, info))
    sourceEmitter.trigger('foo', 'proxied foo')
    sourceEmitter.trigger('bar', 'proxied bar')
    sourceEmitter.trigger('baz', 'proxied baz')
  })
}

test('it throws an error if `sourceEmitter` is no emitter', (t) => {
  t.plan(3)
  setup((source, target) => {
    t.throws(() => proxyTrigger({}, target, 'foo'), /source.+no.+emitter/)
    t.throws(() => proxyTrigger(null, target, 'foo'), /source.+no.+emitter/)
    t.throws(() => proxyTrigger('emitter', target, 'foo'), /source.+no.+emitter/)
  })
})

test('it throws an error if `targetEmitter` is no emitter', (t) => {
  t.plan(3)
  setup((source) => {
    t.throws(() => proxyTrigger(source, {}, 'foo'), /target.+no.+emitter/)
    t.throws(() => proxyTrigger(source, null, 'foo'), /target.+no.+emitter/)
    t.throws(() => proxyTrigger(source, 'emitter', 'foo'), /target.+no.+emitter/)
  })
})

test('it throws an error if type of `events` is invalid', (t) => {
  t.plan(5)
  setup((source, target) => {
    t.throws(() => proxyTrigger(source, target, {}), /type.+events.+invalid/)
    t.throws(() => proxyTrigger(source, target, null), /type.+events.+invalid/)
    t.throws(() => proxyTrigger(source, target, 1), /type.+events.+invalid/)
    t.throws(() => proxyTrigger(source, target, /.*/), /type.+events.+invalid/)
    t.throws(() => proxyTrigger(source, target), /type.+events.+invalid/)
  })
})

test('it proxies a single event with all arguments', (t) => {
  t.plan(1)
  setup((sourceEmitter, targetEmitter) => {
    proxyTrigger(sourceEmitter, targetEmitter, 'foo')
    targetEmitter.on('foo', (a, b, c) => {
      t.ok(a === 1 && b === 2 && c === 3, 'proxied with args')
    })
    sourceEmitter.trigger('foo', 1, 2, 3)
  })
})

test('it proxies multiple events with a space-separated string', (t) => {
  t.plan(9)
  fooBarBaz('foo bar   baz', t)
  fooBarBaz('  foo bar baz', t)
  fooBarBaz('foo bar baz  ', t)
})

test('it proxies multiple events with an array of strings', (t) => {
  t.plan(3)
  fooBarBaz(['foo', 'bar', 'baz'], t)
})

test('it proxies multiple events with an array of (space-separated) strings', (t) => {
  t.plan(6)
  fooBarBaz(['foo bar', 'baz'], t)
  fooBarBaz(['foo', 'bar baz'], t)
})

test('it proxies multiple events once even if defined twice', (t) => {
  t.plan(9)
  fooBarBaz('foo foo bar foo baz', t)
  fooBarBaz(['foo', 'bar', 'foo', 'foo baz'], t)
  fooBarBaz(['foo bar foo', 'foo', 'baz'], t)
})

test('it can be used as a mixin', (t) => {
  t.plan(1)
  setup((sourceEmitter, targetEmitter) => {
    Object.assign(targetEmitter, proxyTriggerMixin)
    targetEmitter.proxyTrigger(sourceEmitter, 'foo')
    targetEmitter.on('foo', () => t.ok(true, 'proxied'))
    sourceEmitter.trigger('foo')
  })
})

