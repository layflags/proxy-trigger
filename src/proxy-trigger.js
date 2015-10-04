function proxyTriggerSingle (sourceEmitter, targetEmitter, event) {
  targetEmitter.listenTo(sourceEmitter, event, (...args) => {
    targetEmitter.trigger(event, ...args)
  })
}

export default function proxyTrigger (sourceEmitter, targetEmitter, events) {
  events.split(/\s+/).forEach((event) => {
    proxyTriggerSingle(sourceEmitter, targetEmitter, event)
  })
}

export const mixin = Object.freeze({
  proxyTrigger (sourceEmitter, events) {
    proxyTrigger(sourceEmitter, this, events)
  }
})

