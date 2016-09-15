import React, { Component, PropTypes } from 'react'
import { browserHistory } from 'react-router'
import { connect } from 'react-redux'
import {
  Row,
  Col,
  Grid,
  Icon,
  Form,
  Panel,
  Button,
  PanelBody,
  FormGroup,
  PanelHeader,
  FormControl,
  PanelFooter,
  PanelContainer,
} from '@sketchpixy/rubix';
import { setEntryTextValue, createTestSlides } from '../actions';
import prepositions from './../wordpackets/prepositions.json'

class TextArea extends React.Component {
  constructor(props) {
    super(props)
    this.processText = this.processText.bind(this)
    this.createText = this.createText.bind(this)
    this.shuffleArray = this.shuffleArray.bind(this)
    this.createHintsArray = this.createHintsArray.bind(this)
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

  processText(event) {
    // const terms = prepositions.list
    // let text = this.props.rawText
    //
    // if(!text) {
    //   return
    // }
    //
    // let sentences = text.split('.')
    //
    // let wordsAndBlanks = sentences.map((sentence) => {
    //   let words = sentence.split(' ')
    //
    //   return {
    //     words: words
    //   }
    // })
    //
    // let challenges = wordsAndBlanks.map((wab) => {
    //   let sentence = []
    //   let blanks = 0
    //
    //   for(let w = 0; w < wab.words.length; w++) {
    //     let indexOf = terms.indexOf(wab.words[w])
    //
    //     if(indexOf >= 0) {
    //       blanks++;
    //
    //       sentence.push({
    //         value: wab.words[w],
    //         hidden: true,
    //         word: terms[indexOf],
    //         hints: this.createHintsArray(terms, {
    //           index: indexOf,
    //           value: terms[indexOf]
    //         }),
    //         answer: '',
    //         typing: '',
    //         last: w === wab.words.length-1 ? true : false
    //       })
    //     }
    //     else {
    //       sentence.push({
    //         value: wab.words[w],
    //         hidden: false,
    //         last: w === wab.words.length-1 ? true : false
    //       })
    //     }
    //   }
    //
    //   if(blanks) {
    //     return sentence
    //   }
    //   else {
    //     return undefined
    //   }
    //
    // });
    // challenges = challenges.filter(function(n){ return n != undefined });
    //
    // challenges = this.shuffleArray(challenges)
    // alert('hi')
    // this.props.createTestSlides(challenges)
    browserHistory.push('slides/1')
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
                          <FormControl componentClass='TextArea' defaultValue={this.props.rawText} onKeyUp={this.createText} className="leengo-textarea" rows='15'
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
                        <Button outlined onClick={this.processText} bsStyle='darkgreen'>Create Test!</Button>
                      </div>
                      <br/>
                    </Col>
                  </Row>
                </Grid>
              </PanelFooter>
            </Panel>
          </Form>
        </PanelContainer>
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
