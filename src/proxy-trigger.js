import flatten from 'lodash.flatten'
import uniq from 'lodash.uniq'

function proxyTriggerSingle (sourceEmitter, targetEmitter, event) {
  targetEmitter.listenTo(sourceEmitter, event, (...args) => {
    targetEmitter.trigger(event, ...args)
  })
}

export default function proxyTrigger (sourceEmitter, targetEmitter, events) {
  let eventList = Array.isArray(events) ? events : [events]

  eventList = uniq(flatten(eventList.map(event => event.trim().split(/\s+/))))
  eventList.forEach((event) => {
    proxyTriggerSingle(sourceEmitter, targetEmitter, event)
  })
}

export const mixin = Object.freeze({
  proxyTrigger (sourceEmitter, events) {
    proxyTrigger(sourceEmitter, this, events)
  }
})

