/*
 * @Author: shimingxia
 * @Date: 2022-08-24 18:57:31
 * @LastEditors: shimingxia
 * @LastEditTime: 2022-08-25 13:42:48
 * @Description: 
 */
import React from './react'
import ReactDOM from './react-dom'

class Counter extends React.Component {
  constructor(props) {
    super(props)
    this.state = { number: 0, age: 13 }
  }
  handleClick = (amount) => {
    // this.setState({ number: this.state.number + amount })
    // this.setState({ number: this.state.number + amount }, () => {
    //   console.log('callback', this.state)
    // })
    this.setState((state) => ({number: state.number + amount}), () => {
      console.log('callback', this.state)
    })
    console.log(this.state)
  }
  render() {
    return (
     <div>
      <p>number: { this.state.number }</p>
      <button onClick={() => this.handleClick(5)}>+</button>
     </div>
    )
  }
}
let element = <Counter />
// console.log(element)
ReactDOM.render(
  element,
  document.getElementById('root')
)

