/*
 * @Author: shimingxia
 * @Date: 2022-08-24 18:57:31
 * @LastEditors: shimingxia
 * @LastEditTime: 2022-08-25 11:00:28
 * @Description: 
 */
import React from './react'
import ReactDOM from './react-dom'
// let element = <h1 className='title' id='title' style={{color: 'red'}}>Stoney</h1>
function FunctionComponent(props) {
  return (
    <h1 className='title' style={{color: 'red'}}>
      <span>{props.name}</span>
      <span>{props.children}</span>
    </h1>
  )
}
let element = <FunctionComponent name="hello">world</FunctionComponent>
// console.log(element)
ReactDOM.render(
  element,
  document.getElementById('root')
)

