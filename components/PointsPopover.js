import React, { Component, PropTypes } from 'react'
import {
  Icon,
  Popover,
  OverlayTrigger
} from '@sketchpixy/rubix'

export default class PointsPopover extends React.Component {
  render() {
    return (
      <OverlayTrigger
        trigger="click"
        id="answerpopover"
        overlay={
          <Popover title='Time Popover'>
            <p>
              Calculating points is really down to the secret sauce of our program! <br />
              Nevertheless we can share a couple of details to help you work on your
              results... :)<br /><br />
              In a nutshell, the points are derived from following data:
              <ul>
                <li>How many answers you got right (duh!)</li>
                <li>Amount of time it took you to finish the test</li>
                <li>How long and how difficult was the test</li>
              </ul>

              Hope this helps and good luck with future results!
            </p>
          </Popover>}>
        <Icon
          className="fg-green show-hint icon-simple-line-icons-question rubix-icon"
          glyph=""
        />
      </OverlayTrigger>
    )
  }
}
