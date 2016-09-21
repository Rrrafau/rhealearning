import React, { Component, PropTypes } from 'react'
import { Provider } from 'react-redux'
import { Router, Route, IndexRoute } from 'react-router'
import { browserHistory } from 'react-router'
import { syncHistoryWithStore } from 'react-router-redux'
import Layout from '../components/Layout'
import Landing from '../components/Landing'
import Slides from '../components/Slides'
import Results from '../components/Results'
import Dashboard from '../components/Dashboard'
import News from '../components/News'
import configureStore from '../store/configureStore'

const store = configureStore()

let history = browserHistory
if(typeof history !== 'undefined') {
  history = syncHistoryWithStore(browserHistory, store)
}

const appRoutes = () => (
  <Route path="/" component={Layout}>
    <IndexRoute component={Landing} />
    <Route path="/slides/:id" component={Slides} />
    <Route path="/results" component={Results} />
    <Route path="/dashboard" component={Dashboard} />
    <Route path="/news" component={News} />
  </Route>
)

class Root extends Component {
  constructor() {
    super()
  }

  render() {
    return (
      <Provider store={store}>
        <Router history={history}>
          {appRoutes()}
        </Router>
      </Provider>
    )
  }
}

// Root.propTypes = {
//   store: PropTypes.object.isRequired,
//   history: PropTypes.object.isRequired
// }

Root.Routes = appRoutes

export const Routes = Root.Routes
export const Store = store

export default Root
