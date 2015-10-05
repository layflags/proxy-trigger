import isObject from 'lodash.isobject'
import isString from 'lodash.isstring'
import impl from 'implements'

function isEmitter (emitter) {
  const emitterInterface = ['trigger', 'listenTo', 'on', 'off', 'stopListening']

  return isObject(emitter) && impl(emitter, emitterInterface)
}

function proxyTriggerSingle (srcEmitter, targetEmitter, origEvent, newEvent) {
  targetEmitter.listenTo(srcEmitter, origEvent, (...args) => {
    targetEmitter.trigger(newEvent, ...args)
  })
}

export default function proxyTrigger (sourceEmitter, targetEmitter, events) {
  if (!isEmitter(sourceEmitter)) throw new Error('source is not an emitter')
  if (!isEmitter(targetEmitter)) throw new Error('target is not an emitter')

  const eventList = Array.isArray(events) ? events : [events]
  const eventMap = new Map()

  eventList.forEach((event) => {
    if (isString(event)) {
      event.trim().split(/\s+/).forEach((evt) => {
        if (evt !== '') eventMap.set(evt, evt)
      })
    } else {
      throw new Error('events format is invalid')
    }
  })

  eventMap.forEach((origEvent, newEvent) => {
    proxyTriggerSingle(sourceEmitter, targetEmitter, origEvent, newEvent)
  })
}

export const mixin = Object.freeze({
  proxyTrigger (sourceEmitter, events) {
    proxyTrigger(sourceEmitter, this, events)
  }
})

