import flatten from 'lodash.flatten'
import uniq from 'lodash.uniq'
import isObject from 'lodash.isobject'
import isString from 'lodash.isstring'
import impl from 'implements'

function isEmitter (emitter) {
  const emitterInterface = ['trigger', 'listenTo', 'on', 'off', 'stopListening']

  return isObject(emitter) && impl(emitter, emitterInterface)
}

function isValidEventsType (events) {
  return Array.isArray(events) || isString(events)
}

function proxyTriggerSingle (sourceEmitter, targetEmitter, event) {
  targetEmitter.listenTo(sourceEmitter, event, (...args) => {
    targetEmitter.trigger(event, ...args)
  })
}

export default function proxyTrigger (sourceEmitter, targetEmitter, events) {
  if (!isEmitter(sourceEmitter)) throw new Error('source is not an emitter')
  if (!isEmitter(targetEmitter)) throw new Error('target is not an emitter')
  if (!isValidEventsType(events)) throw new Error('type of events is invalid')

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

