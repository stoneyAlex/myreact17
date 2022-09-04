/*
 * @Author: shimingxia
 * @Date: 2022-08-24 18:57:31
 * @LastEditors: shimingxia
 * @LastEditTime: 2022-08-26 13:41:34
 * @Description: 
 */
import React from 'react'
import ReactDOM from 'react-dom'

class Counter extends React.Component {
  static defaultProps = {
    name: 'stoney'
  }
  constructor(props) {
    super(props)
    this.state = {number: 0}
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
        {this.state.number === 4 ? null : <ChildCounter count = {this.state.number} />}
        <button onClick={this.handleClick}>+</button>
      </div>
    )
  }
}

class ChildCounter extends React.Component {
  componentWillMount() {
    console.log('ChildCounter 1, componentWillMount')
  }
  componentDidMount() {
    console.log('ChildCounter 3, componentDidMount')
  }
  componentWillReceiveProps(nextProps, nextState) {
    console.log('ChildCounter 4, componentWillReceiveProps', nextProps)
  }
  shouldComponentUpdate(nextProps, nextState) {
    console.log('ChildCounter 5, shouldComponentUpdate')
    return nextProps.count % 3 === 0
  }
  componentWillUnmount() {
    console.log('ChildCounter 8, componentWillUnmount')
  }
  componentWillUpdate() {
    console.log('ChildCounter 6, componentWillUpdate')
  }
  componentDidUpdate() {
    console.log('ChildCounter 7, componentDidUpdate')
  }
  render() {
    console.log('ChildCounter 2, render')
    return (
      <div id='sub-counter'>{this.props.count}</div>
    )
  }
}

let element = <Counter />
// console.log(element)
ReactDOM.render(
  element,
  document.getElementById('root')
)

