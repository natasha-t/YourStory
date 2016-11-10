import React from 'react'
import { connect } from 'react-redux'
import store from '../store'
import { Profile } from './detailed'

@connect((store) => {
  return {
    visData: store.visData
  }
})

export default class App extends React.Component {
  constructor () {
    super()
    this.state = {value: ''}
  }

  handleChange (event) {
    console.log(event.target.value)
    this.setState({value: event.target.value})
  }

  render () {
    const { visData } = this.props

    return (
      <div>
        <button href='./profile'>
          reload
        </button>
        <form>
          Name:
          <input
            type='text'
            name='name'
            value={this.state.value}
            onChange={this.handleChange.bind(this)} />
        </form>
        Hello
        {this.state.value} from app.jsx
        {visData}
        <Profile />
      </div>
    )
  }
}
