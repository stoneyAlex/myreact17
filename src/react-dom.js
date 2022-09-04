/*
 * @Author: shimingxia
 * @Date: 2022-08-25 10:40:36
 * @LastEditors: shimingxia
 * @LastEditTime: 2022-08-26 14:38:12
 * @Description: 
 */
import {REACT_TEXT, REACT_FORWARD_REF_TYPE, PLACEMENT, MOVE, REACT_CONTEXT, REACT_PROVIDER } from './constant'
import { addEvent } from './event'

function render(vdom, container) {
  mount(vdom, container)
}

function mount(vdom, container) {
  let newDOM = createDOM(vdom)
  if(newDOM) {
    container.appendChild(newDOM)
    if(newDOM.componentDidMount) {
      newDOM.componentDidMount()
    }
  }
}

function createDOM(vdom) {
  let { type, props, ref } = vdom
  let dom
  if(type && type.$$typeof === REACT_FORWARD_REF_TYPE) {
    return mountForwardComponent(vdom)
  } else if(type && type.$$typeof === REACT_PROVIDER) {
    return mountProviderComponent(vdom)
  } else if(type && type.$$typeof === REACT_CONTEXT) {
    return mountContextComponent(vdom)
  } else if(type === REACT_TEXT) {
    dom = document.createTextNode(props)
  } else if (typeof type === 'function') {
    if(type.isReactComponent) {
      return mountClassComponent(vdom)
    } else {
      return mountFunctionComponent(vdom)
    }
  } else {
    dom = document.createElement(type)
  }
  if(props) {
    updatedProps(dom, null, props)
    const children = props.children
    if(typeof children === 'object' && children.type) {
      children.mountIndex = 0
      mount(children, dom)
    } else if(Array.isArray(children)) {
      reconcileChildren(children, dom)
    }
  }
  vdom.dom = dom
  if(ref) {
    ref.current = dom
  }
  return dom
}

function mountProviderComponent(vdom) {
  let { type, props } = vdom
  let context = type._context
  context._currentValue = props.value
  let renderVdom = props.children
  vdom.oldRenderVdom = renderVdom
  return createDOM(renderVdom)
}

function mountContextComponent(vdom) {
  let { type, props } = vdom
  let context = type._context
  let renderVdom = props.children(context._currentValue)
  vdom.oldRenderVdom = renderVdom
  return createDOM(renderVdom)
}

function mountForwardComponent(vdom) {
  let { type, props, ref } = vdom
  let renderVdom = type.render(props, ref)
  vdom.oldRenderVdom = renderVdom
  return createDOM(renderVdom)
}

function mountFunctionComponent(vdom) {
  let { type, props } = vdom
  let renderVdom = type(props)
  vdom.oldRenderVdom = renderVdom
  return createDOM(renderVdom)
}

function mountClassComponent(vdom) {
  let { type: ClassComponent, props, ref } = vdom
  let classInstance = new ClassComponent(props)
  vdom.classInstance = classInstance
  if(ClassComponent.contextType) {
    classInstance.context = ClassComponent.contextType._currentValue
  }
  if(ref) ref.current = classInstance
  if(classInstance.componentWillMount) {
    classInstance.componentWillMount()
  }
  let renderVdom = classInstance.render()
  classInstance.oldRenderVdom = renderVdom
  let dom = createDOM(renderVdom)
  if(classInstance.componentDidMount) {
    dom.componentDidMount = classInstance.componentDidMount.bind(classInstance)
  }
  return dom
}

function reconcileChildren(children, parentDOM) {
  children.forEach((child, index) => {
    child.mountIndex = index
    mount(child, parentDOM)
  })
}

function updatedProps(dom, oldProps = {}, newProps = {}) {
  for (let key in newProps) {
    if(key === 'children') {
      continue
    } else if(key === 'style') {
      let styleObj = newProps[key]
      for (let attr in styleObj) {
        dom.style[attr] = styleObj[attr]
      }
    } else if(/^on[A-Z].*/.test(key)) {
      // dom[key.toLocaleLowerCase()] = newProps[key]
      addEvent(dom, key.toLocaleLowerCase(), newProps[key])
    } else {
      dom[key] = newProps[key]
    }
  }
  for (let key in oldProps) {
    if(!newProps.hasOwnProperty(key)) {
      dom[key] = null
    }
  }
}

export function findDOM(vdom) {
  if(!vdom) return null
  if(vdom.dom) {
    return vdom.dom
  } else {
    let oldRenderVdom = vdom.classInstance ? vdom.classInstance.oldRenderVdom : vdom.oldRenderVdom
    return findDOM(oldRenderVdom)
  }
}

export function compareTwoVdom(parentDOM, oldVdom, newVdom, nextDOM) {
  // let oldDOM = findDOM(oldVdom)
  // let newDOM = createDOM(newVdom)
  // parentDOM.replaceChild(newDOM, oldDOM)
  if(!oldVdom && !newVdom) {
    return
  } else if(oldVdom && !newVdom) {
    unMountVdom(oldVdom)
  } else if(!oldVdom && newVdom) {
    let newDOM = createDOM(newVdom)
    if(nextDOM) {
      parentDOM.insertBefore(newDOM, nextDOM)
    } else {
      parentDOM.appendChild(newDOM)
    }
    if(newDOM.componentDidMount) {
      newDOM.componentDidMount()
    }
  } else if(oldVdom && newVdom && oldVdom.type !== newVdom.type) {
    unMountVdom(oldVdom)
    let newDOM = createDOM(newVdom)
    if(nextDOM) {
      parentDOM.insertBefore(newDOM, nextDOM)
    } else {
      parentDOM.appendChild(newDOM)
    }
    if(newDOM.componentDidMount) {
      newDOM.componentDidMount()
    }
  } else {
    updateElement(oldVdom, newVdom)
  }
}

function updateElement(oldVdom, newVdom) {
  if(oldVdom.type.$$typeof === REACT_PROVIDER) {
    return updateProviderComponent(oldVdom, newVdom)
  } else if(oldVdom.type.$$typeof ===REACT_CONTEXT) {
    return updateContextComponent(oldVdom, newVdom)
  }else if(oldVdom.type === REACT_TEXT) {
    let currentDOM = newVdom.dom = findDOM(oldVdom)
    if(oldVdom.props !== newVdom.props) {
      currentDOM.textContent = newVdom.props
    }
  } else if(typeof oldVdom.type === 'string') {
    let currentDOM = newVdom.dom = findDOM(oldVdom)
    updatedProps(currentDOM, oldVdom.props, newVdom.props)
    updateChildren(currentDOM, oldVdom.props.children, newVdom.props.children)
  } else if(typeof oldVdom.type === 'function') {
    if(oldVdom.type.isReactComponent) {
      // newVdom.classInstance = oldVdom.classInstance
      updateClassComponent(oldVdom, newVdom)
    } else {
      updateFunctionComponent(oldVdom, newVdom)
    }
  }
}

function updateContextComponent(oldVdom, newVdom) {
  let oldDOM = findDOM(oldVdom)
  let parentDOM = oldDOM.parentNode
  let { type, props } = newVdom
  let context = type._context
  let renderVdom = props.children(context._currentValue)
  compareTwoVdom(parentDOM, oldVdom.oldRenderVdom, renderVdom)
  newVdom.oldRenderVdom = renderVdom
}

function updateProviderComponent(oldVdom, newVdom) {
  let oldDOM = findDOM(oldVdom)
  let parentDOM = oldDOM.parentNode
  let { type, props } = newVdom
  let context = type._context
  context._currentValue = props.value
  let renderVdom = props.children
  compareTwoVdom(parentDOM, oldVdom.oldRenderVdom, renderVdom)
  newVdom.oldRenderVdom = renderVdom
}

function updateFunctionComponent(oldVdom, newVdom) {
  let currentDOM = findDOM(oldVdom)
  if(!currentDOM) return
  let parentDOM = currentDOM.parentNode
  let { type, props } = newVdom
  let newRenderVdom = type(props)
  compareTwoVdom(parentDOM, oldVdom.oldRenderVdom, newRenderVdom)
  newVdom.oldRenderVdom = newRenderVdom
}

function updateClassComponent(oldVdom, newVdom) {
  let classInstance = newVdom.classInstance = oldVdom.classInstance
  if(classInstance.componentWillReceiveProps) {
    classInstance.componentWillReceiveProps(newVdom.props)
  }
  classInstance.updater.emitUpdate(newVdom.props)
}

function updateChildren(parentDOM, oldVChildren, newVChildren) {
  oldVChildren = (Array.isArray(oldVChildren) ? oldVChildren : [oldVChildren]).filter(item => item)
  newVChildren = (Array.isArray(newVChildren) ? newVChildren : [newVChildren]).filter(item => item)
  // let maxLength =Math.max(oldVChildren.length, newVChildren.length)
  // for(let i = 0; i < maxLength; i++) {
  //   let nextVdom = oldVChildren.find((item, index) => index > i && item && findDOM(item))
  //   compareTwoVdom(parentDOM, oldVChildren[i], newVChildren[i], nextVdom && findDOM(nextVdom))
  // }
  let keyedOldMap = {}
  let lastPlacedIndex = 0
  oldVChildren.forEach((oldVChild, index) => {
    keyedOldMap[oldVChild.key || index] = oldVChild
  })
  let patch = []
  newVChildren.forEach((newVChild, index) => {
    let newKey = newVChild.key || index
    let oldVChild = keyedOldMap[newKey]
    if(oldVChild) {
      updateElement(oldVChild, newVChild)
      if(oldVChild.mountIndex < lastPlacedIndex) {
        patch.push({
          type: MOVE,
          oldVChild,
          newVChild,
          mountIndex: index
        })
      }
      delete keyedOldMap[newKey]
      lastPlacedIndex = Math.max(lastPlacedIndex, oldVChild.mountIndex)
    } else {
      patch.push({
        type: PLACEMENT,
        newVChild,
        mountIndex: index
      })
    }
  })
  let moveChild = patch.filter(action => action.type === MOVE).map(action => action.oldVChild)
  Object.values(keyedOldMap).concat(moveChild).forEach(oldVChild => {
    let currentDOM = findDOM(oldVChild)
    parentDOM.removeChild(currentDOM)
  })
  if(patch) {
    patch.forEach(action => {
      let { type, oldVChild, newVChild, mountIndex } = action
      let childNodes = parentDOM.childNodes
      let currentDOM
      if(type === PLACEMENT) {
        currentDOM = createDOM(newVChild)
      } else if(type === MOVE) {
        currentDOM = findDOM(oldVChild)
      }
      let childNode = childNodes[mountIndex]
      if(childNode) {
        parentDOM.insertBefore(currentDOM, childNode)
      } else {
        parentDOM.appendChild(currentDOM)
      }
    })
  }
}

function unMountVdom(vdom) {
  let { type, props, ref } = vdom
  let currentDOM = findDOM(vdom)
  if(vdom.classInstance && vdom.classInstance.componentWillUnmount) {
    vdom.classInstance.componentWillUnmount()
  }
  if(ref) {
    ref.current = null
  }
  if(props.children) {
    let children = Array.isArray(props.children) ? props.children : [props.children]
    children.forEach(unMountVdom)
  }
  if(currentDOM) {
    currentDOM.parentNode.removeChild(currentDOM)
  }
}

const ReactDOM = {
  render
}

export default ReactDOM