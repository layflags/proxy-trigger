import isObject from 'lodash.isobject'
import isPlainObject from 'lodash.isplainobject'
import isString from 'lodash.isstring'
import impl from 'implements'

const eventsFormatInvalidError = new Error('events format is invalid')
const emitterInterface = ['trigger', 'listenTo', 'on', 'off', 'stopListening']

function isEmitter (emitter) {
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

  eventList.forEach((eventish) => {
    if (isString(eventish)) {
      eventish.trim().split(/\s+/).forEach((event) => {
        if (event === '') throw eventsFormatInvalidError
        eventMap.set(event, event)
      })
    } else if (isPlainObject(eventish)) {
      Object.keys(eventish).forEach((origEvent) => {
        const newEvent = eventish[origEvent]

        if (!isString(newEvent) || newEvent.trim() === '') {
          throw eventsFormatInvalidError
        }
        eventMap.set(origEvent, newEvent)
      })
    } else {
      throw eventsFormatInvalidError
    }
  })

  eventMap.forEach((newEvent, origEvent) => {
    proxyTriggerSingle(sourceEmitter, targetEmitter, origEvent, newEvent)
  })
}

export const mixin = Object.freeze({
  proxyTrigger (sourceEmitter, events) {
    proxyTrigger(sourceEmitter, this, events)
  }
})

