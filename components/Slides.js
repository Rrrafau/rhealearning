import React, { Component, PropTypes } from 'react'
import { browserHistory } from 'react-router'
import { connect } from 'react-redux'
import {
  Row,
  Col,
  Grid,
  Icon,
  Link,
  Form,
  Panel,
  Button,
  Popover,
  OverlayTrigger,
  PanelBody,
  FormGroup,
  PanelHeader,
  FormControl,
  PanelFooter,
  PanelContainer,
} from '@sketchpixy/rubix'
import { submitTestAnswer, typeTestAnswer, prepareResults } from '../actions';
import '../public/css/slides.css'

class Slides extends React.Component {
  constructor() {
    super()
    this.buildSentence = this.buildSentence.bind(this)
    this.navigateNext = this.navigateNext.bind(this)
    this.handleChange = this.handleChange.bind(this)
    this.submitAnswer = this.submitAnswer.bind(this)
    this.showHints = this.showHints.bind(this)
  }

  submitAnswer(event) {
    event.preventDefault()

    this.props.submitTestAnswer()
    this.navigateNext()
  }

  handleChange(event) {
    let answer = {
      key: event.target.name.split('_')[0],
      answer: event.target.value,
      question: parseInt(this.props.params.id, 10)-1
    };

    this.props.typeTestAnswer(answer)
  }

  showHints() {

  }

  navigateNext() {
    let nextID = parseInt(this.props.params.id, 10)+1

    if(this.props.slides[nextID-1]) {
      browserHistory.push('/slides/'+nextID)
    }
    else {
      this.props.prepareResults()
      browserHistory.push('/results') // results
    }
  }

  buildSentence(sentence) {
    let that = this

    return sentence.map(function(word, i) {
      let delimiter = word.last ? '' : ' '

      if(!word.hidden) {
        return word.value + delimiter
      }
      else {
        if(word.answer.length) {
          return ( <input
            type="text"
            disabled
            value={word.answer}
            key={i+'_'+that.props.params.id}
            name={i}
            className="test-input-inline test-input-inline-with-answer"
            onChange={that.handleChange}
          /> )
        }
        else {
          return (
            <span>
              <input
                type="text"
                key={i+'_'+that.props.params.id}
                name={i}
                className="test-input-inline"
                onChange={that.handleChange}
              />
            <OverlayTrigger overlay={
                <Popover title='Hints:' id='popover'>
                  {
                    that.props.slides[that.props.params.id-1][i].hints.map(function(hint) {
                      return (
                        <p>{hint.toUpperCase()}</p>
                      )
                    })
                  }
                </Popover>}>
              <Icon key={i+'_icon'+that.props.params.id} className="fg-green show-hint icon-simple-line-icons-question rubix-icon"/>
            </OverlayTrigger>&nbsp;
            </span>
          )
        }
      }
    })
  }

  render() {
    const sentence = this.props.slides[this.props.params.id-1]
    const current = this.props.params.id;
    const total = this.props.slides.length;

    return (
      <div>
        <PanelContainer noOverflow>
          <Panel>
            <form onSubmit={this.submitAnswer}>
              <PanelBody>
                <Grid>
                  <Row>
                    <Col sm={12} className="text-sentence-container">
                      <div className="sentence-count text-right">Sentence {current} of {total}</div>
                      {this.buildSentence(sentence)}.
                    </Col>
                  </Row>
                </Grid>
              </PanelBody>
              <PanelFooter className='text-right'>
                <Grid>
                  <Row>
                    <Col xs={12}>
                      <br/>
                      <div>
                        <Button type="submit" outlined bsStyle='no-outline darkgreen'>NEXT</Button>
                      </div>
                      <br/>
                    </Col>
                  </Row>
                </Grid>
              </PanelFooter>
            </form>
          </Panel>
        </PanelContainer>
      </div>
    )
  }
}

function mapStateToProps(state) {
  const { slides } = state.tests;
  const { isAuthenticated } = state.auth;
  return { slides, isAuthenticated };
}

export default connect(mapStateToProps, {submitTestAnswer, prepareResults, typeTestAnswer})(Slides)
