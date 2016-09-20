import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { login, logout } from '../actions';
import Header from '../components/Header'
import Sidebar from '../components/Sidebar'
import TextArea from '../components/TextArea'
import classNames from 'classnames';

import {
  MainContainer,
  Grid,
  Row,
  Col,
  } from '@sketchpixy/rubix';

class Layout extends Component {
  constructor(props) {
    super(props)
    this.handleLoginClick = this.handleLoginClick.bind(this)
    this.handleLogoutClick = this.handleLogoutClick.bind(this)
  }

  handleLoginClick() {
    this.props.login()
  }

  handleLogoutClick() {
    this.props.logout()
  }

  render() {
    const { isAuthenticated, profile } = this.props
    return (
      <MainContainer {...this.props}>
        { isAuthenticated ? (
          <Sidebar
            isAuthenticated={isAuthenticated}
            profile={profile}
          />
        ) : null }
        <Header
          isAuthenticated={isAuthenticated}
          onLoginClick={this.handleLoginClick}
          onLogoutClick={this.handleLogoutClick}
        />
        <div id='body'>
          <Grid>
            <Row>
              <Col xs={12}>
                {this.props.children}
              </Col>
            </Row>
          </Grid>
        </div>
      </MainContainer>
    )
  }
}

function mapStateToProps(state) {
  const { auth } = state
  const { isAuthenticated, profile } = auth
  return {
    isAuthenticated,
    profile
  }
}

export default connect(mapStateToProps, {
  login,
  logout
})(Layout)
