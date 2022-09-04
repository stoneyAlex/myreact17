/*
 * @Author: shimingxia
 * @Date: 2022-08-24 18:57:31
 * @LastEditors: shimingxia
 * @LastEditTime: 2022-08-25 19:13:37
 * @Description: 
 */
import React from './react'
import ReactDOM from './react-dom'

function TextInput(props, forwardRef) {
  return <input ref={forwardRef} />
}

const ForwardedTextInput = React.forwardRef(TextInput)

class Form extends React.Component {
  constructor(props) {
    super(props)
    this.textInputRef = React.createRef()
  }
  getFocus = () => {
    this.textInputRef.current.focus()
  }
  render() {
    return (
      <div>
        <ForwardedTextInput ref = {this.textInputRef} />
        <button onClick={this.getFocus}>获得焦点</button>
      </div>
    )
  }
}

let element = <Form />
// console.log(element)
ReactDOM.render(
  element,
  document.getElementById('root')
)

