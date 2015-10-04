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

test('it proxies a single event', (t) => {
  setup((sourceEmitter, targetEmitter) => {
    t.plan(1)

    proxyTrigger(sourceEmitter, targetEmitter, 'foo')
    targetEmitter.on('foo', (a, b, c) => {
      t.ok(a === 1 && b === 2 && c === 3, 'proxied with args')
    })
    sourceEmitter.trigger('foo', 1, 2, 3)
  })
})

test('it proxies multiple event with a space-separated string', (t) => {
  setup((sourceEmitter, targetEmitter) => {
    t.plan(3)

    proxyTrigger(sourceEmitter, targetEmitter, 'foo bar   baz')
    targetEmitter.on('foo bar baz', (info) => t.ok(true, info))
    sourceEmitter.trigger('foo', 'proxied foo')
    sourceEmitter.trigger('bar', 'proxied bar')
    sourceEmitter.trigger('baz', 'proxied baz')
  })
})

test('it can be used as a mixin', (t) => {
  setup((sourceEmitter, targetEmitter) => {
    t.plan(1)

    Object.assign(targetEmitter, proxyTriggerMixin)
    targetEmitter.proxyTrigger(sourceEmitter, 'foo')
    targetEmitter.on('foo', () => t.ok(true, 'proxied'))
    sourceEmitter.trigger('foo')
  })
})

