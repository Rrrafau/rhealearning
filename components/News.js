import React, { Component, PropTypes } from 'react'
import {
  Col,
  Grid,
  Panel,
  PanelBody,
  PanelHeader,
  PanelFooter,
  PanelContainer,
} from '@sketchpixy/rubix'

export default class AnswerTimePopover extends React.Component {
  render() {
    return (
      <PanelContainer>
        <Panel>
          <PanelBody>
            <PanelHeader>
              <Col xs={12}>
                <h3 className="text-green news-title">We have added points, average time per answer and new hints system!</h3>
                <hr></hr>
              </Col>
            </PanelHeader>
            <PanelBody>
              <Grid>
                <Col xs={12} className="text-lighter">
                  <h3>Big News, we've added tons of new features and fixes:</h3>
                  <h4>New scoring system (alongside % complete)</h4>
                  <img style={{opacity: 0.5}} width="350px" src='/public/imgs/common/1.png' />
                  <p>
                    Each time you complete a test, you will now receive points which
                    are caclulated based on complexity of the test and how well
                    have you done:
                  </p>
                  <hr></hr>
                  <h4>Average time per RIGHT answer</h4>
                  <p>
                    When you go to your dashboard you will now be able to see
                    how long it takes you to come up with the <i>right</i> answer.
                    That's right! Not just any anwser, only right anwers. For details,
                    visit your dashboard.
                  </p>
                  <hr></hr>
                  <h4>Hints are now clickable</h4>
                  <img style={{opacity: 0.5}} width="350px" src='/public/imgs/common/2.png' />
                  <p>
                    Yes!!! We know you asked for it and we delivered! It's a small
                    improvement but it makes a huge difference! From now on you no longer
                    need to type an answer, you can just click the hings icon and then
                    click the answer you think is correct, and the answer will get
                    submitted for you! Amazing, right! We're glad you're loving it!
                  </p>
                  <hr></hr>
                  <h4>What's next on our road map:</h4>
                  <ul>
                    <li>Leveling system! (based on your points acquisition)</li>
                    <li>Connect with your FB friends and see their results! (if they let you)</li>
                    <li>Badges and rewards!</li>
                    <li>... and much more</li>
                  </ul>
                  <p>... stay tuned!</p>
                </Col>
              </Grid>
            </PanelBody>
            <PanelFooter>
              <Col xs={12}>
                <p style={{textAlign: 'right'}} className="news-footer">Submitted by: Leengo, Thursday, Sep 22 2016</p>
              </Col>
            </PanelFooter>
          </PanelBody>
        </Panel>
      </PanelContainer>
    )
  }
}
