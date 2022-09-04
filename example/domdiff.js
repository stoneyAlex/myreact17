/*
 * @Author: shimingxia
 * @Date: 2022-08-24 18:57:31
 * @LastEditors: shimingxia
 * @LastEditTime: 2022-08-26 14:41:08
 * @Description: 
 */
import React from './react'
import ReactDOM from './react-dom'

class Counter extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      list: ['A', 'B', 'C', 'D', 'E', 'F']
      // list: [['A', 'B'],[ 'C', 'D'], ['E', 'F']]
    }
  }

  handleClick = () => {
    // this.setState({list: ['A', 'C', 'E', 'B', 'G']})
    this.setState({list: ['A', 'G', 'C', 'F', 'K']})
  }

  render() {
    return (
      <div>
        <ul>
          {
            this.state.list.map(item => <li key={item} >{item}</li>)
            // React.Children.map(this.state.list, item => <li key={item} >{item}</li>)
          }
        </ul>
        <button onClick={this.handleClick}>+</button>
      </div>
    )
  }
}

let element = <Counter />
ReactDOM.render(
  element,
  document.getElementById('root')
)

