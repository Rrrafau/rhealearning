import React, { Component, PropTypes } from 'react'
import { browserHistory } from 'react-router'
import { connect } from 'react-redux'
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
import '../public/css/results.css'
import { setEntryTextValue } from '../actions';

class Results extends React.Component {
  constructor() {
    super();
    this.getPercenage = this.getPercenage.bind(this)
    this.restartTest = this.restartTest.bind(this)
  }

  restartTest() {
    this.props.setEntryTextValue('')
    browserHistory.push('/')
  }

  getPercenage() {
    if(this.props.results.right > 0 && this.props.results.total > 0) {
      let result = Math.floor(1*(this.props.results.right/this.props.results.total)*100)
      if(result < 20) {
        return (
          <div>
            <h1>Your score is
              <span>
                <span className="percent-20"> {result}%</span>...
                <span className="percent-20"> You need to try harder, {this.props.profile.name}!</span>
              </span>
            </h1>
            <Progress id='demo-progress' value={result} color='#e85f5f'/>
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
            <Progress id='demo-progress' value={result} color='#ff8031'/>
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
            <Progress id='demo-progress' value={result} color='#8cc8dc'/>
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
            <Progress id='demo-progress' value={result} color='#61af61'/>
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
            <Progress id='demo-progress' value={result} color='#61af61'/>
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
            <Progress id='demo-progress' value={result} color='#61af61'/>
          </div>
        )
      }
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
    const { results, slides } = this.props
    console.log(this.props.profile)
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

                    <h3 className="review-answers">Review your answers:</h3>
                    <hr />
                    <div className="results-text">
                    {slides.map(function(sentence, s) {
                      return (
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
                          <hr />
                        </p>
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
  const { results, slides } = state.tests;
  const { isAuthenticated, profile } = state.auth;
  return { results, slides, profile, isAuthenticated };
}

export default connect(mapStateToProps, { setEntryTextValue })(Results)
