import React, { Component, PropTypes } from 'react'
import { Provider } from 'react-redux'
import { Router, Route, IndexRoute } from 'react-router'
import Layout from '../components/Layout'
import Landing from '../components/Landing'
import Slides from '../components/Slides'
import Results from '../components/Results'

export default class Root extends Component {
  render() {
    const { store, history } = this.props
    return (
      <Provider store={store}>
        <Router history={history}>
          <Route path="/" component={Layout}>
            <IndexRoute component={Landing} />
            <Route path="/slides/:id" component={Slides} />
            <Route path="/results" component={Results} />
          </Route>
        </Router>
      </Provider>
    )
  }
}

Root.propTypes = {
  store: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired
}
