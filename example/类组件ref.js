/*
 * @Author: shimingxia
 * @Date: 2022-08-24 18:57:31
 * @LastEditors: shimingxia
 * @LastEditTime: 2022-08-25 18:58:48
 * @Description: 
 */
import React from './react'
import ReactDOM from './react-dom'

class Form extends React.Component {
  constructor(props) {
    super(props)
    this.textInputRef = React.createRef()
  }
  getFocus = () => {
    this.textInputRef.current.getFocus()
  }
  render() {
    return (
      <div>
        <TextInput ref = {this.textInputRef} />
        <button onClick={this.getFocus}>获得焦点</button>
      </div>
    )
  }
}

class TextInput extends React.Component {
  constructor(props) {
    super(props)
    this.inputRef = React.createRef()
  }
  getFocus = () => {
    this.inputRef.current.focus()
  }
  render() {
    return (
      <input ref={this.inputRef} />
    )
  }
}

let element = <Form />
// console.log(element)
ReactDOM.render(
  element,
  document.getElementById('root')
)

