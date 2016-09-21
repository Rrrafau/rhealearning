import React, { Component, PropTypes } from 'react'
import { browserHistory } from 'react-router'
import { connect } from 'react-redux'
import ReactDOM from 'react-dom'
import {
  Row,
  Col,
  Grid,
  Icon,
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
import {
  submitTestAnswer,
  typeTestAnswer,
  prepareResults,
  saveResult
} from '../actions';

class Slides extends React.Component {
  constructor() {
    super()
    this.buildSentence = this.buildSentence.bind(this)
    this.navigateNext = this.navigateNext.bind(this)
    this.handleChange = this.handleChange.bind(this)
    this.submitAnswer = this.submitAnswer.bind(this)
    this.bodyOnClick = this.bodyOnClick.bind(this);
  }

  componentDidMount() {
    document.getElementById('body').onclick = this.bodyOnClick
  }

  componentWillUnmount() {
    document.getElementById('body').removeAttribute('onclick')
  }

  bodyOnClick(event) {
    var trigger = this.refs.trigger;
    var overlayElem = ReactDOM.findDOMNode(this.refs.overlay);

    if(trigger && overlayElem) {
      if (trigger.state.show) {
          trigger.setState({
              show: false
          });
      }
    }
  }

  submitAnswer(event) {
    event.preventDefault()

    this.props.submitTestAnswer()
    this.navigateNext()
  }

  clickHint(word, i, id, sentence) {
    let answer = {
      key: i.toString(),
      answer: word,
      question: id-1
    }

    let that = this

    this.props.typeTestAnswer(answer)

    // @todo learn how to do this properly
    for(var i = 0; i < 1000; i++) {
      if(this.refs['trigger'+i]) {
        this.refs['trigger'+i].setState({show: false})
      }
    }
  }

  handleChange(event) {
    let answer = {
      key: event.target.name.split('_')[0],
      answer: event.target.value,
      question: parseInt(this.props.params.id, 10)-1
    }

    this.props.typeTestAnswer(answer)
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
            defaultValue={word.typing}
          /> )
        }
        else {
          return (
            <span key={i+'_span'+that.props.params.id}>
              <input
                type="text"
                key={i+'_input'+that.props.params.id}
                name={i}
                className="test-input-inline"
                onChange={that.handleChange}
                value={word.typing}
              />
              <OverlayTrigger
                trigger="click"
                ref={"trigger"+i}
                key={i+'_ot'+that.props.params.id}
                overlay={
                  <Popover title='Hints:' id={i + '_' + word.value} ref={"overlay"+i} key={i+'_pop'+that.props.params.id}>
                    {
                      that.props.slides[that.props.params.id-1][i].hints.map(function(hint) {
                        return (
                          <p className="popover-hint"
                            onClick={(e) => that.clickHint(
                              e.target.innerHTML.toLowerCase(),
                              i,
                              that.props.params.id
                            )}
                            key={i+hint+'_p'+that.props.params.id}>
                            {hint.toUpperCase()}
                          </p>
                        )
                      })
                    }
                  </Popover>}>
                <Icon
                  key={i+'_icon'+that.props.params.id}
                  className="fg-green show-hint icon-simple-line-icons-question rubix-icon"
                  glyph=""
                />
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
        <PanelContainer noOverflow onClick={this.clearPopovers}>
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
  const { slides, wordPacket } = state.tests;
  const { isAuthenticated, profile } = state.auth;

  return { slides, isAuthenticated, profile, wordPacket };
}

export default connect(mapStateToProps, {
  submitTestAnswer,
  prepareResults,
  typeTestAnswer,
  saveResult
})(Slides)
