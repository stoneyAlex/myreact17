/*
 * @Author: shimingxia
 * @Date: 2022-08-25 11:11:32
 * @LastEditors: shimingxia
 * @LastEditTime: 2022-08-26 10:20:03
 * @Description: 
 */
import { findDOM, compareTwoVdom } from './react-dom'
export let updateQueue = {
  isBatchingUpdate: false,
  updaters: new Set(),
  batchUpdate() {
    for(let updater of updateQueue.updaters) {
      updater.updateComponent()
    }
    updateQueue.isBatchingUpdate = false
    updateQueue.updaters.clear()
  }
}
class Updater {
  constructor(classInstance) {
    this.classInstance = classInstance;
    this.pendingStates = []
    this.callbacks = []
  }
  addState(partialState, callback) {
    this.pendingStates.push(partialState)
    if(typeof callback === 'function') {
      this.callbacks.push(callback)
    }
    this.emitUpdate()
  }
  emitUpdate(nextProps) {
    this.nextProps = nextProps
    if(updateQueue.isBatchingUpdate) {
      updateQueue.updaters.add(this)
    } else {
      this.updateComponent()
    }
  }
  updateComponent() {
    let { classInstance, pendingStates, nextProps, callbacks } = this
    if(nextProps || pendingStates.length > 0) {
      shouldUpdate(classInstance, nextProps, this.getState())
    }
    if(callbacks.length > 0) {
      callbacks.forEach(callback => callback())
      callbacks.length = 0
    }
  }
  getState() {
    let { classInstance, pendingStates } = this
    let { state } = classInstance
    pendingStates.forEach((partialState) => {
      if(typeof partialState === 'function') {
        partialState = partialState(state)
      }
      state = { ...state, ...partialState }
    })
    pendingStates.length = 0
    return state
  }
}
function shouldUpdate(classInstance, nextProps, nextState) {
  let willUpdate = true
  if(classInstance.shouldComponentUpdate && !classInstance.shouldComponentUpdate(nextProps, nextState)) {
    willUpdate = false
  }
  if(willUpdate && classInstance.componentWillUpdate) {
    classInstance.componentWillUpdate()
  }
  classInstance.state = nextState
  if(nextProps) classInstance.props = nextProps
  if(willUpdate) {
    classInstance.forceUpdate()
  }
}
export class Component {
  static isReactComponent = true
  constructor(props) {
    this.props = props
    this.state = {}
    this.updater = new Updater(this)
  }
  setState(partialState, callback){
    this.updater.addState(partialState, callback)
  }
  forceUpdate() {
    let oldRenderVdom = this.oldRenderVdom
    let oldDOM = findDOM(oldRenderVdom)
    if(this.constructor.contextType) {
      this.context = this.constructor.contextType._currentValue
    }
    if(this.constructor.getDerivedStateFromProps) {
      let newState = this.constructor.getDerivedStateFromProps(this.props, this.state)
      if(newState) this.state = {...this.state, ...newState}
    }
    let snapshot = this.getSnapshotBeforeUpdate && this.getSnapshotBeforeUpdate()
    let newRenderVdom = this.render()
    compareTwoVdom(oldDOM.parentNode, oldRenderVdom, newRenderVdom)
    this.oldRenderVdom = newRenderVdom
    if(this.componentDidUpdate) {
      this.componentDidUpdate(this.props, this.state, snapshot)
    }
  }
}