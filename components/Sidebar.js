import React from 'react';

import {
  Sidebar, SidebarNav, SidebarNavItem,
  SidebarControls, SidebarControlBtn,
  Grid, Row, Col, FormControl,
  Label, Progress, Icon,
  SidebarDivider
} from '@sketchpixy/rubix';
import '../public/css/sidebar.css';

export default class SidebarContainer extends React.Component {
  render() {
    const { isAuthenticated, profile } = this.props
    return (
      <div id='sidebar' className="leengo-sidebar" {...this.props}>
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
                  <a href='#'>
                    <Icon id='demo-icon' bundle='fontello' glyph='lock-5' />
                  </a>
                </div>
              </Col>
            </Row>
          </Grid>
        </div>
      ) : null}
        <div id='sidebar-container'>

        </div>
      </div>
    );
  }
}
