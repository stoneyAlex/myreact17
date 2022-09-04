/*
 * @Author: shimingxia
 * @Date: 2022-08-24 18:57:31
 * @LastEditors: shimingxia
 * @LastEditTime: 2022-08-25 11:16:47
 * @Description: 
 */
import React from './react'
import ReactDOM from './react-dom'
// let element = <h1 className='title' id='title' style={{color: 'red'}}>Stoney</h1>
class ClassComponent extends React.Component {
  render() {
    return (
      <h1 className='title' style={{color: 'red'}}>
        <span>{this.props.name}</span>
        <span>{this.props.children}</span>
      </h1>
    )
  }
}
let element = <ClassComponent name="hello">world</ClassComponent>
// console.log(element)
ReactDOM.render(
  element,
  document.getElementById('root')
)

