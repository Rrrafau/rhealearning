import React, { Component, PropTypes } from 'react'
import { Link } from 'react-router'
import {
  Grid,
  Row,
  Col,
  Navbar,
  SidebarBtn,
  Nav,
  OverlayTrigger,
  Popover,
  Icon,
  NavItem,
  Progress
  } from '@sketchpixy/rubix';

class Brand extends React.Component {
  render() {
    return (
      <Navbar.Header {...this.props}>
        <Navbar.Brand tabIndex='-1'>
          <Link to="/">
            <img src={require('../public/imgs/common/logos.png')} alt='Leengo' width='111' />
          </Link>
        </Navbar.Brand>
      </Navbar.Header>
    );
  }
}

class HeaderNavigation extends React.Component {
  constructor(props) {
    super(props)
  }
  render() {
    const { onLoginClick, onLogoutClick, isAuthenticated } = this.props
    const popoverClick = (
      <Popover id="popover-trigger-click" title="Welcome!">
        <strong>Login in</strong>  to start mastering your english in less than a minute!
      </Popover>
    );

    return (
      <Nav pullRight>
        { !isAuthenticated ? (
          <OverlayTrigger defaultOverlayShown={true} placement="bottom" overlay={popoverClick}>
            <NavItem className='login' href='#' onClick={onLoginClick}>
              <Icon bundle='fontello' glyph='off-1' />
            </NavItem>
          </OverlayTrigger>
        ) : (
          <NavItem className='logout' href='#' onClick={onLogoutClick}>
            <Icon bundle='fontello' glyph='off-1' />
          </NavItem>
        )}
      </Nav>
    );
  }
}

export default class Header extends React.Component {
  render() {
    const { isAuthenticated } = this.props
    return (
      <Grid id='navbar'>
        <Row>
          <Col xs={12}>
            <Navbar fixedTop fluid id='rubix-nav-header'>
              { isAuthenticated ? (
                <Row>
                  <Col xs={3} visible='xs'>
                    <SidebarBtn />
                  </Col>
                  <Col xs={6} sm={4}>
                    <Brand />
                  </Col>
                  <Col xs={3} sm={8} collapseRight className='text-right'>
                    <HeaderNavigation {...this.props}/>
                  </Col>
                </Row>
              ) : (
                <Row>
                  <Col xs={3} visible='xs'></Col>
                  <Col xs={6} sm={4}>
                    <Brand />
                  </Col>
                  <Col xs={3} sm={8} collapseRight className='text-right'>
                    <HeaderNavigation {...this.props}/>
                  </Col>
                </Row>
              )}

            </Navbar>
          </Col>
        </Row>
      </Grid>
    );
  }
}
