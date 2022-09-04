/*
 * @Author: shimingxia
 * @Date: 2022-08-24 18:57:31
 * @LastEditors: shimingxia
 * @LastEditTime: 2022-08-25 18:51:52
 * @Description: 
 */
import React from './react'
import ReactDOM from './react-dom'

class Sum extends React.Component {
  constructor(props) {
    super(props)
    this.a = React.createRef()
    this.b = React.createRef()
    this.result = React.createRef()
  }
  handleClick = (event) => {
    let valueA = this.a.current.value
    let valueB = this.b.current.value
    this.result.current.value = valueA + valueB
  }
  render() {
    return (
      <div>
        <input ref={this.a} /> + <input ref={this.b} />
        <button onClick={this.handleClick}>=</button>
        <input ref={this.result} />
      </div>
    )
  }
}
let element = <Sum />
// console.log(element)
ReactDOM.render(
  element,
  document.getElementById('root')
)

