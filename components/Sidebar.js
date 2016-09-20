import React from 'react';
import { connect } from 'react-redux'
import { Link } from 'react-router'
import {
  Sidebar, SidebarNav, SidebarNavItem,
  SidebarControls, SidebarControlBtn,
  Grid, Row, Col, FormControl,
  Label, Progress,
  SidebarDivider
} from '@sketchpixy/rubix';

class SidebarContainer extends React.Component {
  render() {

    const { isAuthenticated, profile } = this.props

    return (
      <div id='sidebar' className="leengo-sidebar" >
        { isAuthenticated ? (
        <div id='avatar'>
          <Grid>
            <Row className='fg-white'>
              <Col xs={4} collapseRight>
                <img style={{borderRadius: 20}} src={profile.picture} width='40' height='40' />
              </Col>
              <Col xs={8} collapseLeft id='avatar-col'>
                <div style={{top: 23, fontSize: 16, lineHeight: 1, position: 'relative'}}>{profile.name}</div>
                <div>
                  <Progress id='demo-progress' value={30} color='#ffffff'/>
                </div>
              </Col>
            </Row>
          </Grid>
        </div>
        ) : null}
        <SidebarControls>
          <SidebarControlBtn bundle='fontello' glyph='docs' sidebar={0} />
        </SidebarControls>
        { /** had to paste the plain html because this fucking theme wouldn't work... */ }
        <div className="container-fluid">
          <div className="row">
            <div className="col-xs-12">
              <div className="sidebar-nav-container">
                <ul style={{marginBottom:0}} className="sidebar-nav">
                  <li style={{display:'block',pointerEvents:'all',height:45}} tabIndex="-1" className="sidebar-nav-item">
                    <Link to="/" style={{height:45}}>
                      <span className="icon-outlined-pencil rubix-icon"></span>
                      <span className="name">New Test</span>
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-xs-12">
              <div className="sidebar-nav-container">
                <ul style={{marginBottom:0}} className="sidebar-nav">
                  <li style={{display:'block',pointerEvents:'all',height:45}} tabIndex="-1" className="sidebar-nav-item">
                    <Link to="/dashboard" style={{height:45}}>
                      <span className="icon-outlined-graph-rising rubix-icon"></span>
                      <span className="name">Dashboard</span>
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {}
}
export default connect(mapStateToProps, {})(SidebarContainer)
