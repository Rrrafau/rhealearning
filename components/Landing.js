import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import TextArea from './TextArea'
import '../public/css/landing.css';

function mapStateToProps(state) {
  const { auth } = state
  const { isAuthenticated, profile } = auth
  return {
    isAuthenticated,
    profile
  }
}

class Landing extends Component {
  constructor(props) {
    super(props)
  }
  render() {
    const { profile, isAuthenticated } = this.props
    return (
      <div>
        <div>
          { !isAuthenticated ? null : (
            <TextArea profile={profile} />
          )}
        </div>
      </div>
    )
  }
}

export default connect(mapStateToProps)(Landing)
