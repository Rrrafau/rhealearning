import React, { Component, PropTypes } from 'react'
import { browserHistory, Link } from 'react-router'
import { connect } from 'react-redux'
import axios from 'axios'
import {
  Row,
  Col,
  Grid,
  Icon,
  Form,
  Panel,
  Modal,
  Button,
  PanelBody,
  FormGroup,
  PanelHeader,
  FormControl,
  PanelFooter,
  PanelContainer,
} from '@sketchpixy/rubix';
import { setEntryTextValue, createTestSlides } from '../actions'
import prepositions from './../wordpackets/prepositions.json'
import linking from './../wordpackets/linkingverbs.json'
import helping from './../wordpackets/helpingverbs.json'
import irregulars from './../wordpackets/irregulars.json'

class TextArea extends React.Component {
  constructor(props) {
    super(props)
    this.processText = this.processText.bind(this)
    this.createText = this.createText.bind(this)
    this.shuffleArray = this.shuffleArray.bind(this)
    this.createHintsArray = this.createHintsArray.bind(this)
    this.close = this.close.bind(this)
    this.open = this.open.bind(this)
    this.createPrepositions = this.createPrepositions.bind(this)
    this.createIrregulars = this.createIrregulars.bind(this)
    this.createHelpingVerbs = this.createHelpingVerbs.bind(this)
    this.createLinkingVerbs = this.createLinkingVerbs.bind(this)
    this.createIrregularChallenges = this.createIrregularChallenges.bind(this)
    this.createRegularChallenges = this.createRegularChallenges.bind(this)

    this.state = {
      showModal: false,
      linking: linking,
      helping: helping,
      irregulars: irregulars,
      prepositions: prepositions,
    }
  }

  componentWillMount() {
    console.log(this.props)
  }

  close() {
    this.setState({ showModal: false });
  }

  open() {
    this.setState({ showModal: true });
  }

  createText(event) {
    this.props.setEntryTextValue(event.target.value)
  }

  shuffleArray(array) {
    for (var i = array.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1))
      var temp = array[i]
      array[i] = array[j]
      array[j] = temp
    }
    return array
  }

  createHintsArray(words, answer) {
    let lenght = words.length
    let nums = []
    let hints = []

    for(let i = 0; i < words.length; i++) {
      if(i !== answer.index) {
        nums.push(i)
      }
    }

    nums = this.shuffleArray(nums)

    for(let i = 0; i < 4; i++) {
      hints.push(words[nums[i]])
    }

    hints.push(answer.value)

    hints = this.shuffleArray(hints)

    return hints
  }

  createPrepositions(event) {
    this.processText(event, 'prepositions')
  }

  createLinkingVerbs(event) {
    this.processText(event, 'linking')
  }

  createHelpingVerbs(event) {
    this.processText(event, 'helping')
  }

  createIrregulars(event) {
    this.processText(event, 'irregulars')
  }

  createIrregularChallenges(wordsAndBlanks, terms) {

    let challenges = wordsAndBlanks.map((wab) => {
      let sentence = []
      let blanks = 0

      for(let w = 0; w < wab.words.length; w++) {
        if(terms[wab.words[w]]) {

          blanks++;
          sentence.push({
            value: wab.words[w].toLowerCase(),
            hidden: true,
            word: wab.words[w],
            hints: [terms[wab.words[w]]],
            answer: '',
            typing: '',
            last: w === wab.words.length-1 ? true : false
          })
        }
        else {
          sentence.push({
            value: wab.words[w],
            hidden: false,
            last: w === wab.words.length-1 ? true : false
          })
        }
      }

      if(blanks) {
        return sentence
      }
      else {
        return undefined
      }

    });

    return challenges
  }

  createRegularChallenges(wordsAndBlanks, terms) {
    let challenges = wordsAndBlanks.map((wab) => {
      let sentence = []
      let blanks = 0

      for(let w = 0; w < wab.words.length; w++) {
        let indexOf = terms.indexOf(wab.words[w])

        if(indexOf >= 0) {
          blanks++;

          sentence.push({
            value: wab.words[w].toLowerCase(),
            hidden: true,
            word: terms[indexOf],
            hints: this.createHintsArray(terms, {
              index: indexOf,
              value: terms[indexOf]
            }),
            answer: '',
            typing: '',
            last: w === wab.words.length-1 ? true : false
          })
        }
        else {
          sentence.push({
            value: wab.words[w],
            hidden: false,
            last: w === wab.words.length-1 ? true : false
          })
        }
      }

      if(blanks) {
        return sentence
      }
      else {
        return undefined
      }

    });

    return challenges
  }

  processText(event, wordPacket) {
    const terms = this.state[wordPacket].list
    let text = this.props.rawText
    let challenges = []

    if(!text) {
      return
    }

    let sentences = text.split('.')

    let wordsAndBlanks = sentences.map((sentence) => {
      let words = sentence.split(' ')

      return {
        words: words
      }
    })

    console.log(wordPacket, terms);
    if(wordPacket !== 'irregulars') {
      challenges = this.createRegularChallenges(wordsAndBlanks, terms)
    }
    else {
      challenges = this.createIrregularChallenges(wordsAndBlanks, terms)
    }
    challenges = challenges.filter(function(n){ return n != undefined })

    challenges = this.shuffleArray(challenges)

    if(challenges.length) {
      this.props.createTestSlides(challenges, wordPacket)
      browserHistory.push('slides/1')
    }
    else {
      alert('We could not generate any tests :(, Please use differnt text or select more paragraphs.')
    }
  }

  render() {
    const { profile } = this.props
    return (
      <div>
        <h2 className="h2welcome">Welcome to Leengo, {this.props.profile.given_name}!</h2>
        <PanelContainer noOverflow>
          <Form>
            <Panel>
              <PanelHeader className='bg-blue fg-white'>
                <Grid>
                  <Row>
                    <Col xs={12}>
                      <h3><Icon bundle='fontello' glyph='clipboard' />&nbsp;Paste your text into this text area and begin your challenge!</h3>
                    </Col>
                  </Row>
                </Grid>
              </PanelHeader>
              <PanelBody>
                <Grid>
                  <Row>
                    <FormGroup>
                      <Col sm={12}>
                        <FormControl componentClass='TextArea' defaultValue={this.props.rawText} onChange={this.createText} className="leengo-textarea" rows='15'
                            placeholder="This area is for the text that will be turned into an interactive language test!
                                          Feel free to paste whatever you want as long as it's in plain english.
                                          We will take care of the rest! If you can't think of any good sources of
                                          articles, try wikipedia.org or BBC News. Or perhaps you have a favorite
                                          eBook which you would like to turn into a quick language challenge?" />
                      </Col>
                    </FormGroup>
                  </Row>
                </Grid>
              </PanelBody>
              <PanelFooter className='text-right'>
                <Grid>
                  <Row>
                    <Col xs={12}>
                      <br/>
                      <div>
                        <Link to="https://en.wikipedia.org/wiki/Special:Random" target="_blank" onClick={(event) => {event.preventDefault(); window.open("https://en.wikipedia.org/wiki/Special:Random");}} >
                        <Button outlined onClick={this.getRandom} className='pull-left' bsStyle='darkblue'>Feeling lazy? Grab a random article!</Button>
                        </Link>
                      </div>
                      <div>
                        <Button outlined onClick={this.open} bsStyle='darkgreen'>Create Test! (Text will be randomized)</Button>
                      </div>
                      <br/>
                    </Col>
                  </Row>
                </Grid>
              </PanelFooter>
            </Panel>
          </Form>
        </PanelContainer>
        <Modal className="custom-modal" show={this.state.showModal} onHide={this.close}>
          <Modal.Header closeButton>
            <Modal.Title>Choose what you want to train:</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Grid>
              <Row>
                <Col xs={12}>
                  <FormGroup>
                    <Button bsStyle='blue' onClick={this.createPrepositions} className="learnenglish-btn">Prepositions</Button>
                    <p className="learnenglish-sample">(e.g. as, at, of, aboard, during, towards, etc.)</p>
                  </FormGroup>
                </Col>
                <Col xs={12}>
                  <FormGroup>
                    <Button bsStyle='green' onClick={this.createIrregulars} className="learnenglish-btn">Irregular Verbs</Button>
                    <p className="learnenglish-sample">(e.g. what is the past participle of "seek")</p>
                  </FormGroup>
                </Col>
                <Col xs={12}>
                  <FormGroup>
                    <Button bsStyle='orange75' onClick={this.createLinkingVerbs} className="learnenglish-btn">Linking Verbs</Button>
                    <p className="learnenglish-sample">(forms of: be, sensory verbs, etc.)</p>
                  </FormGroup>
                </Col>
                <Col xs={12}>
                  <FormGroup>
                    <Button bsStyle='brownishgray75' onClick={this.createHelpingVerbs} className="learnenglish-btn">Helping verbs</Button>
                    <p className="learnenglish-sample">(forms of: be, have, do, does, should, would, etc.)</p>
                  </FormGroup>
                </Col>
                <Col xs={12}>
                  <FormGroup>
                    <Button bsStyle='gray75' disabled className="learnenglish-btn">Personalized list (coming soon)</Button>
                    <p className="learnenglish-sample">(personalized tests built by our hard working robots)</p>
                  </FormGroup>
                </Col>
                <Col xs={12}>
                  <FormGroup>
                    <div className="robots">
                      <img style={{opacity: 0.5}} className="pull-right" width="50px" src='/public/imgs/common/robot-1.png' />
                      <img style={{opacity: 0.5}} className="pull-right" width="50px" src='/public/imgs/common/robot.png' />
                      <img style={{opacity: 0.5}} className="pull-right" width="50px" src='/public/imgs/common/robot-1.png' />
                      <img style={{opacity: 0.5}} className="pull-right" width="50px" src='/public/imgs/common/robot.png' />
                      <img style={{opacity: 0.5}} className="pull-right" width="50px" src='/public/imgs/common/robot-1.png' />
                      <img style={{opacity: 0.5}} className="pull-right" width="50px" src='/public/imgs/common/robot.png' />
                      <img style={{opacity: 0.5}} className="pull-right" width="50px" src='/public/imgs/common/robot-1.png' />
                      <img style={{opacity: 0.5}} className="pull-right" width="50px" src='/public/imgs/common/robot.png' />
                      <img style={{opacity: 0.5}} className="pull-right" width="50px" src='/public/imgs/common/robot-1.png' />
                      <img style={{opacity: 0.5}} className="pull-right" width="50px" src='/public/imgs/common/robot.png' />
                    </div>
                    <h3 className="pull-right coming-soon">OUR ROBOTS ARE WORKING TIRELESSLY TO ADD MORE TESTS! STAY TUNED...</h3>
                  </FormGroup>
                </Col>
              </Row>
            </Grid>
          </Modal.Body>
          <Modal.Footer>
            <Button onClick={this.close}>Close</Button>
          </Modal.Footer>
        </Modal>
      </div>
    )
  }
}

function mapStateToProps(state) {
  const { rawText, slides } = state.tests;
  return { rawText, slides };
}

export default connect(
  mapStateToProps, {
    setEntryTextValue,
    createTestSlides
  })(TextArea)
