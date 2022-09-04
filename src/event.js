/*
 * @Author: shimingxia
 * @Date: 2022-08-25 13:59:53
 * @LastEditors: shimingxia
 * @LastEditTime: 2022-08-26 10:01:58
 * @Description: 
 */
import { updateQueue } from './Component'

function addEvent(dom, evenType, handler) {
  let store = dom._store || (dom._store = {})
  store[evenType] = handler
  if(!document[evenType]){
    document[evenType] = dispatchEvent;
  }
}

function dispatchEvent(nativeEvent) {
  updateQueue.isBatchingUpdate = true
  let { type, target } = nativeEvent
  let eventType = `on${type}`
  let syntheticEvent = createSyntheticEvent(nativeEvent)
  while(target) {
    let {_store} = target
    let handler = _store && _store[eventType]
    if(handler) handler(syntheticEvent)
    if(syntheticEvent.isPropagationStopped) {
      break
    }
    target = target.parentNode
  }
  updateQueue.isBatchingUpdate = false
  updateQueue.batchUpdate()
}

function createSyntheticEvent(nativeEvent) {
  let syntheticEvent = {}
  for(let key in nativeEvent) {
    let value = nativeEvent[key]
    if(typeof value === 'function') {
      value = value.bind(nativeEvent)
    }
    syntheticEvent[key] = value
  }
  syntheticEvent.nativeEvent = nativeEvent
  syntheticEvent.isPropagationStopped = false
  syntheticEvent.stopPropagation = stopPropagation
  syntheticEvent.defaultPrevented = false
  syntheticEvent.preventDefault = preventDefault
  return syntheticEvent
}

function preventDefault() {
  const event = this.nativeEvent
  if(event.preventDefault) {
    event.preventDefault()
  } else {
    event.returnValue = false
  }
  this.defaultPrevented = true
}

function stopPropagation() {
  const event = this.nativeEvent
  if(event.stopPropagation) {
    event.stopPropagation()
  } else {
    event.cancelBubble = true
  }
  this.isPropagationStopped = true
}

export {
  addEvent
}
