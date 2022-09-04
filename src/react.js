/*
 * @Author: shimingxia
 * @Date: 2022-08-24 20:15:22
 * @LastEditors: shimingxia
 * @LastEditTime: 2022-08-26 14:39:58
 * @Description: 
 */
import { REACT_ELEMENT, REACT_FORWARD_REF_TYPE, REACT_CONTEXT, REACT_PROVIDER } from './constant'
import { wrapToVdom } from './utils'
import { Component } from './Component'

function createElement(type, config, children) {
  let ref, key
  if(config) {
    ref = config.ref
    key = config.key
    delete config.ref
    delete config.key
    delete config.__source
    delete config.__self
  }
  let props = {...config}
  if(arguments.length > 3) {
    props.children = Array.prototype.slice.call(arguments, 2).map(wrapToVdom)
  } else {
    props.children = wrapToVdom(children)
  }
  return {
    $$typeof: REACT_ELEMENT,
    type,
    ref,
    key,
    props
  }
}

function createRef() {
  return {current: null}
}

function forwardRef(render) {
  return {
    $$typeof: REACT_FORWARD_REF_TYPE,
    render
  }
}

let Children = {
  map(children, mapFn) {
    return Array.flatten(children).map(mapFn)
  }
}

function createContext() {
  let context = {$$typeof: REACT_CONTEXT}
  context.Provider = {
    $$typeof: REACT_PROVIDER,
    _context: context
  }
  context.Consumer = {
    $$typeof: REACT_CONTEXT,
    _context: context
  }
  return context
}

const React = {
  createElement,
  Component,
  createRef,
  forwardRef,
  Children,
  createContext
}

export default React