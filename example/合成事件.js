/*
 * @Author: shimingxia
 * @Date: 2022-08-24 18:57:31
 * @LastEditors: shimingxia
 * @LastEditTime: 2022-08-25 15:05:55
 * @Description: 
 */
import React from './react'
import ReactDOM from './react-dom'

class Counter extends React.Component {
  constructor(props) {
    super(props)
    this.state = { number: 0, age: 13 }
  }
  handleClick = (event) => {
    console.log('handlerButtonClick')
    event.stopPropagation()
    this.setState({number: this.state.number + 1})
    console.log(this.state.number)
    this.setState({number: this.state.number + 1})
    console.log(this.state.number)
    setTimeout(() => {
      this.setState({number: this.state.number + 1})
      console.log(this.state.number)
      this.setState({number: this.state.number + 1})
      console.log(this.state.number)
    })
    // this.setState((state) => ({number: state.number + 1}))
    // console.log(this.state.number)
    // this.setState((state) => ({number: state.number + 1}))
    // console.log(this.state.number)
    // setTimeout(() => {
    //   this.setState((state) => ({number: state.number + 1}))
    //   console.log(this.state.number)
    //   this.setState((state) => ({number: state.number + 1}))
    //   console.log(this.state.number)
    // })
  }
  handleClick2 = () => {
    console.log('handlerDivClick')
  }
  render() {
    return (
     <div onClick={this.handleClick2}>
      <p>number: { this.state.number }</p>
      <button onClick={(event) => this.handleClick(event)}>+</button>
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

