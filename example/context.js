/*
 * @Author: shimingxia
 * @Date: 2022-08-24 18:57:31
 * @LastEditors: shimingxia
 * @LastEditTime: 2022-08-26 14:41:08
 * @Description: 
 */
import React from './react';
import ReactDOM from './react-dom';
const ThemeContext = React.createContext()

class Header extends React.Component {
  static contextType = ThemeContext
  render() {
    return (
      <div style={{ margin: '5px', padding: '5px', border: `5px solid ${this.context.color}`}}>
        Header
        <Title />
      </div>
    )
  }
}

class Title extends React.Component {
  render() {
    return (
     <ThemeContext.Consumer>
      {
        (value) => (
          <div style={{ margin: '5px', padding: '5px', border: `5px solid ${value.color}`}}>
            Title
          </div>
        )
      }
     </ThemeContext.Consumer>
    )
  }
}

class Main extends React.Component {
  static contextType = ThemeContext
  render() {
    return (
      <div style={{ margin: '5px', padding: '5px', border: `5px solid ${this.context.color}`}}>
        Main
        <Content />
      </div>
    )
  }
}

class Content extends React.Component {
  render() {
    return (
     <ThemeContext.Consumer>
      {
        (value) => (
          <div style={{ margin: '5px', padding: '5px', border: `5px solid ${value.color}`}}>
          Content
          <button onClick={() => value.changeColor('red')}>变红</button>
          <button onClick={() => value.changeColor('green')}>变绿</button>
        </div>
        )
      }
     </ThemeContext.Consumer>
    )
  }
}

class Page extends React.Component {
  constructor(props) {
    super(props);
    this.state = { color: 'red' }
  }

  changeColor = (color) => {
    this.setState({ color })
  }
  render() {
    let contextVal = { changeColor: this.changeColor, color: this.state.color }
    return (
      <ThemeContext.Provider value={contextVal}>
        <div style={{ margin: '5px', padding: '5px', border: `5px solid ${this.state.color}`, width: '300px'}}>
          page
          <Header />
          <Main />
        </div>
      </ThemeContext.Provider>
    )
  }
}

ReactDOM.render(<Page />, document.getElementById('root'))
