import React from 'react'
import { connect } from 'react-redux'
import store from '../store'
import History from './history'

@connect((store) => {
  return {
    visData: store.visData
  }
})

export default class App extends React.Component {
  render () {
    return (
      <div>
        <History />
      </div>
    )
  }
}
