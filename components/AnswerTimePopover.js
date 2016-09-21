import React, { Component, PropTypes } from 'react'
import {
  Icon,
  Popover,
  OverlayTrigger
} from '@sketchpixy/rubix'

export default class AnswerTimePopover extends React.Component {
  render() {
    return (
      <OverlayTrigger
        trigger="click"
        id="answerpopover"
        overlay={
          <Popover title='Time Popover'>
            <p>
              Basically an amount of time it takes you to answer a question combined with
              penalties you get from submitting wrong answers.
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
