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
    targetEmitter.on('foo', (info) => t.pass(info))
    targetEmitter.on('bar', (info) => t.pass(info))
    targetEmitter.on('baz', (info) => t.pass(info))
    sourceEmitter.trigger('foo', 'proxied foo')
    sourceEmitter.trigger('bar', 'proxied bar')
    sourceEmitter.trigger('baz', 'proxied baz')
  })
}

test('it throws an error if `sourceEmitter` is no emitter', (t) => {
  t.plan(3)
  setup((source, target) => {
    [{}, null, 'emitter'].forEach((invalid) => {
      t.throws(() => proxyTrigger(invalid, target, 'foo'), /source.+no.+emitter/)
    })
  })
})

test('it throws an error if `targetEmitter` is no emitter', (t) => {
  t.plan(3)
  setup((source) => {
    [{}, null, 'emitter'].forEach((invalid) => {
      t.throws(() => proxyTrigger(source, invalid, 'foo'), /target.+no.+emitter/)
    })
  })
})

test('it throws an error if `events` has an invalid format', (t) => {
  t.plan(5)
  setup((source, target) => {
    ['', null, 1, /.*/, undefined].forEach((invalid) => {
      t.throws(() => proxyTrigger(source, target, invalid), /events.+invalid/)
    })
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

test('it proxies events with name mapping using object notation', (t) => {
  t.plan(3)
  setup((sourceEmitter, targetEmitter) => {
    proxyTrigger(sourceEmitter, targetEmitter, {
      foo: 'target.foo',
      bar: 'barrr',
      baz: 'baz'
    })

    targetEmitter.on('foo', () => t.fail('not proxied foo'))
    targetEmitter.on('bar', () => t.fail('not proxied bar'))

    targetEmitter.on('target.foo', (info) => t.pass(info))
    targetEmitter.on('barrr', (info) => t.pass(info))
    targetEmitter.on('baz', (info) => t.pass(info))

    sourceEmitter.trigger('foo', 'proxied target.foo')
    sourceEmitter.trigger('bar', 'proxied barrr')
    sourceEmitter.trigger('baz', 'proxied baz')
  })
})

test('it even proxies events with name mapping if map is part of array', (t) => {
  t.plan(6)
  fooBarBaz([{foo: 'bar', bar: 'baz', baz: 'foo'}], t)
  fooBarBaz([{foo: 'bar'}, {bar: 'baz'}, {baz: 'foo'}], t)
})

test('it proxies multiple events once even if defined twice', (t) => {
  t.plan(9)
  fooBarBaz('foo foo bar foo baz', t)
  fooBarBaz(['foo', 'bar', {foo: 'foo'}, {foo: 'foo'}, 'foo baz'], t)
  fooBarBaz(['foo bar foo', 'foo', 'baz'], t)
})

test('it can be used as a mixin', (t) => {
  t.plan(1)
  setup((sourceEmitter, targetEmitter) => {
    Object.assign(targetEmitter, proxyTriggerMixin)
    targetEmitter.proxyTrigger(sourceEmitter, 'foo')
    targetEmitter.on('foo', () => t.pass('proxied'))
    sourceEmitter.trigger('foo')
  })
})

