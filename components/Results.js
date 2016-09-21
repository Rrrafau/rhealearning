import React, { Component, PropTypes } from 'react'
import { browserHistory } from 'react-router'
import { connect } from 'react-redux'
import crypto from 'crypto'
import PointsPopover from './PointsPopover'

import {
  Row,
  Col,
  Grid,
  Panel,
  Button,
  Progress,
  PanelBody,
  PanelFooter,
  PanelContainer,
} from '@sketchpixy/rubix'

import { setEntryTextValue, saveResult } from '../actions';

class Results extends React.Component {
  constructor() {
    super();
    this.getPercenage = this.getPercenage.bind(this)
    this.restartTest = this.restartTest.bind(this)
    this.getTestType = this.getTestType.bind(this)
  }

  componentWillMount() {
    let data = this.props.wordPacket + this.props.rawText
    // save result
    if(typeof this.props.results.score !== 'undefined') {
      this.props.saveResult({
        hash: crypto.createHash('md5').update(data).digest("hex"),
        score: this.props.results.score,
        type: this.props.wordPacket,
        userID: this.props.profile.email,
        points: this.props.points,
        avgTimePerAnswer: this.props.avgTimePerAnswer
      })
    }
  }

  restartTest() {
    this.props.setEntryTextValue('')
    browserHistory.push('/')
  }

  getTestType() {
    let wordPacket = this.props.wordPacket
    let title = '';

    switch(wordPacket) {
      case 'prepositions':
      case 'linking':
      case 'helping':
        title = _.capitalize(wordPacket) + ' ' + 'Verbs'
        break
      case 'irregulars':
        title = 'Irregular Verbs'
        break
      case 'pronouns_relative':
      case 'pronouns_personal':
      case 'pronouns_interrogative':
      case 'pronouns_possesive':
      case 'pronouns_reflexive':
      case 'pronouns_demonstrative':
      case 'pronouns_indefinite':
        title = wordPacket.split('_')
        title = _.capitalize(title[1]) + ' ' + _.capitalize(title[0])
        break
    }

    return title
  }

  getPercenage() {
    let result = this.props.results.score

    if(result < 20) {
      return (
        <div>
          <h1>Your score is
            <span>
              <span className="percent-20"> {result}%</span>...
              <span className="percent-20"> You need to try harder, {this.props.profile.given_name}!</span>
            </span>
          </h1>
          <Progress id='demo-progress' label={`${result}%`} value={result} color='#e85f5f'/>
        </div>
      )
    }
    else if(result < 40) {
      return (
        <div>
          <h1>Your score is
            <span>
              <span className="percent-40"> {result}%</span>. Keep practicing, {this.props.profile.given_name}!
            </span>
          </h1>
          <Progress id='demo-progress' label={`${result}%`} value={result} color='#ff8031'/>
        </div>
      )
    }
    else if(result < 60) {
      return (
        <div>
          <h1>Your score is
            <span>
              <span className="percent-60"> {result}%</span>. Not so bad, {this.props.profile.given_name}!
            </span>
          </h1>
          <Progress id='demo-progress' label={`${result}%`} value={result} color='#8cc8dc'/>
        </div>
      )
    }
    else if(result < 80) {
      return (
        <div>
          <h1>Your score is
            <span>
              <span className="percent-80"> {result}%</span>! Well done, {this.props.profile.given_name}!
            </span>
          </h1>
          <Progress id='demo-progress' label={`${result}%`} value={result} color='#61af61'/>
        </div>
      )
    }
    else if(result < 100) {
      return (
        <div>
          <h1>Your score is
            <span>
              <span className="percent-100"> {result}%</span>! Awesome result, {this.props.profile.given_name}!
            </span>
          </h1>
          <Progress id='demo-progress' label={`${result}%`} value={result} color='#61af61'/>
        </div>
      )
    }
    else if(result === 100) {
      return (
        <div>
          <h1>Your score is
            <span>
              <span className="percent-100"> {result}%</span>!!!
              <span className="percent-100"> Fucking perfect, {this.props.profile.given_name}!!!</span>
            </span>
          </h1>
          <Progress id='demo-progress' label={`${result}%`} value={result} color='#61af61'/>
        </div>
      )
    }
    else {
      return (
        <div>
          <h1>Your score is
            <span>
              <span className="percent-20"> 0%</span>... Did you even
              <span className="percent-20"> try</span>, {this.props.profile.given_name}?
            </span>
          </h1>
          <Progress id='demo-progress' value={result} color='#e85f5f'/>
        </div>
      )
    }
  }

  render() {
    const { results, slides, wordPacket, points } = this.props
    console.log(points, this.props)
    return (
      <div>
        <PanelContainer noOverflow>
          <Panel>
            <PanelBody>
              <Grid>
                <Row>
                  <Col sm={12} className="results-overview">
                    <h2>You've entered <span className="result-correct">{results.right} </span>
                      words <span className="result-correct">correctly</span> out of <span className="results-count">{results.total}</span> in total.</h2>
                    {this.getPercenage()}
                    <h3>You're getting <b className="text-blue">{points}</b> points for this test. <PointsPopover /></h3>
                    <h3>Review your answers for: <i className="review-answers">{this.getTestType()}</i></h3>
                    <hr />
                    <div className="results-text">
                    {slides.map(function(sentence, s) {
                      return (
                        <div key={'_div'+s}>
                          <p className="results-p" key={s}>{'"'}
                            {sentence.map(function(word, w) {
                              if(word.hidden) {
                                if(word.answer !== word.word) {
                                  return (
                                    <span key={w+'_'+s}>
                                      <span className="result-incorrect">{word.answer || 'no answer given'}</span>
                                      <span className="result-correction"> instead of </span>
                                      <span className="result-correct">{word.value} </span>
                                    </span>
                                  )
                                }
                                else {
                                  return (
                                    <span key={w+'_'+s}>
                                      <span className="result-correct">{word.answer} </span>
                                      <span className="result-correction"> (correct) </span>
                                    </span>
                                  )
                                }
                              }
                              else {
                                return (
                                  <span key={w+'_'+s} >{word.value} </span>
                                )
                              }
                            })}{'"'}
                          </p>
                          <hr />
                        </div>
                      )
                    })}
                    </div>
                  </Col>
                </Row>
              </Grid>
            </PanelBody>
            <PanelFooter>
              <Grid>
                <Row>
                  <Col xs={12}>
                    <br/>
                    <div>
                      <Button outlined onClick={this.restartTest} bsStyle='darkgreen'>Create New test</Button>
                    </div>
                    <br/>
                  </Col>
                </Row>
              </Grid>
            </PanelFooter>
          </Panel>
        </PanelContainer>
      </div>
    )
  }
}

function mapStateToProps(state) {
  const { results, points, avgTimePerAnswer, slides, wordPacket, rawText } = state.tests;
  const { isAuthenticated, profile } = state.auth;
  return {
    results,
    points,
    avgTimePerAnswer,
    slides,
    profile,
    wordPacket,
    isAuthenticated
  };
}

export default connect(mapStateToProps, {
  saveResult,
  setEntryTextValue
})(Results)
