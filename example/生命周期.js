/*
 * @Author: shimingxia
 * @Date: 2022-08-24 18:57:31
 * @LastEditors: shimingxia
 * @LastEditTime: 2022-08-25 19:47:00
 * @Description: 
 */
import React from './react'
import ReactDOM from './react-dom'

class Counter extends React.Component {
  static defaultProps = {
    name: 'stoney'
  }
  constructor(props) {
    super(props)
    this.state = {number: 1}
    console.log('Counter 1, constructor')
  }
  componentWillMount() {
    console.log('Counter 2, componentWillMount')
  }
  componentDidMount() {
    console.log('Counter 4, componentDidMount')
  }
  shouldComponentUpdate(nextProps, nextState) {
    console.log('Counter 5, shouldComponentUpdate')
    return nextState.number % 2 === 0
  }
  componentWillUpdate() {
    console.log('Counter 6, componentWillUpdate')
  }
  componentDidUpdate() {
    console.log('Counter 7, componentDidUpdate')
  }
  handleClick = () => {
    this.setState({number: this.state.number + 1})
  }
  render() {
    console.log('Counter 3, render')
    return (
      <div>
        <p>{this.state.number}</p>
        <button onClick={this.handleClick}>+</button>
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

