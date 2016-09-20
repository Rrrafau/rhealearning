import React, { Component, PropTypes } from 'react'
import { browserHistory } from 'react-router'
import { connect } from 'react-redux'
import axios from 'axios'
import moment from 'moment'
import _ from 'lodash'
const isBrowser = typeof window !== 'undefined';
const AmCharts = isBrowser ? require( 'amcharts3-react') : undefined;

import {
  Row,
  Col,
  Grid,
  Icon,
  Form,
  Panel,
  Button,
  Checkbox,
  Table,
  Popover,
  ControlLabel,
  OverlayTrigger,
  PanelBody,
  FormGroup,
  PanelHeader,
  FormControl,
  PanelFooter,
  PanelContainer,
} from '@sketchpixy/rubix'
import {
  getResults
} from '../actions';

class TestsTable extends React.Component {
  componentWillMount() {
    let recentTests = []

    if(this.props.data.length) {
      for(let i = (this.props.data.length-1); i > this.props.data.length-6 && i >= 0; i--) {
        let title = ''

        switch(this.props.data[i].type) {
          case 'irregulars':
            title = "Irregular Verbs"
            break;
          case 'linking':
            title = "Linking Verbs"
            break;
          case 'helping':
            title = "Helping Verbs"
            break;
          case 'prepositions':
            title = "Prepositions"
            break;
          case 'pronouns_demonstrative':
            title = "Pronouns Demonstrative"
            break;
          case 'pronouns_indefinite':
            title = "Pronouns Indefinite"
            break;
          case 'pronouns_interrogative':
            title = "Pronouns Interrogative"
            break;
          case 'pronouns_personal':
            title = "Pronouns Personal"
            break;
          case 'pronouns_possesive':
            title = "Pronouns Possesive"
            break;
          case 'pronouns_reflexive':
            title = "Pronouns Reflexive"
            break;
          case 'pronouns_relative':
            title = "Pronouns Relative"
            break;

        }

        this.props.data[i].title = title

        recentTests.push(this.props.data[i])
      }
    }

    this.setState({recentTests})
  }

  render() {
    return (
      <Table>
        <thead>
          <tr>
            <th>#</th>
            <th>Most Recent Tests</th>
            <th>Test Type</th>
            <th>Score</th>
          </tr>
        </thead>
        <tbody>
            {this.state.recentTests.map((test, i) => (
              <tr key={i}>
                <td>{i+1}</td>
                <td className="text-lighter">{moment(test.date).format('dddd, MMM Do YYYY')}</td>
                <td className="text-lighter">{'"'+test.title+'"'}</td>
                <td className="text-lighter text-blue">{test.score}%</td>
              </tr>
            ))}
        </tbody>
      </Table>
    )
  }
}

class Dashboard extends React.Component {
  constructor() {
    super()
    this.setChartOption = this.setChartOption.bind(this)
    this.handleSelectChange = this.handleSelectChange.bind(this)
    this.groupByInterval = this.groupByInterval.bind(this)
    this.handleCheckboxChange = this.handleCheckboxChange.bind(this)
    this.loadData = this.loadData.bind(this)
    this.setChunkedData = this.setChunkedData.bind(this)
    this.setChartData = this.setChartData.bind(this)
    this.setGraphs = this.setGraphs.bind(this)
    this.setTimeline = this.setTimeline.bind(this)
    this.calculateTotals = this.calculateTotals.bind(this)
    this.selectPastCombined = this.selectPastCombined.bind(this)
    this.state = {
      data: null, // seleted data type not group by interval chunks
      chartData: null, // currently shown data
      chunkedData: null, // data in interval chunks
      allData: null, // all data that never gets mutated
      type: 'smoothedLine',
      categoryField: 'date',
      interval: 'week',
      minPeriod: 'DD',
      valueField: 'score',
      parseDates: true,
      timeline: new Date(moment().subtract(31, 'days')),
      prepositions: true,
      linking: true,
      irregulars: true,
      helping: true,
      pronouns_relative: true,
      pronouns_personal: true,
      pronouns_interrogative: true,
      pronouns_possesive: true,
      pronouns_reflexive: true,
      pronouns_demonstrative: true,
      pronouns_indefinite: true,
      combine: true,
      pastCombined: 0,
      graphs: [],
      categories: [
        'prepositions',
        'linking',
        'helping',
        'irregulars',
        'pronouns_relative',
        'pronouns_personal',
        'pronouns_interrogative',
        'pronouns_possesive',
        'pronouns_reflexive',
        'pronouns_demonstrative',
        'pronouns_indefinite',
      ],
      totals: {
        totalAvgPronounsDemonstrative: 0,
        totalPronounsDemonstrative: 0,
        totalAvgPronounsIndefinite: 0,
        totalPronounsIndefinite: 0,
        totalAvgPronounsInterrogative: 0,
        totalPronounsInterrogative: 0,
        totalAvgPronounsPersonal: 0,
        totalPronounsPersonal: 0,
        totalAvgPronounsPossesive: 0,
        totalPronounsPossesive: 0,
        totalAvgPronounsReflexive: 0,
        totalPronounsReflexive: 0,
        totalAvgPronounsRelative: 0,
        totalPronounsRelative: 0,
        totalAvgPrepositions: 0,
        totalPrepositions: 0,
        totalAvgIrregulars: 0,
        totalIrregulars: 0,
        totalAvgLinking: 0,
        totalLinking: 0,
        totalAvgHelping: 0,
        totalHelping: 0,
      }
    }
  }

  handleSelectChange(e) {
    let option = {};

    option[e.target.name] = e.target.value

    this.setChartOption(option, this.loadData)
  }

  selectPastCombined(e) {
    let pastCombined = this.getPastCombined(parseInt(e.target.value, 10))

    this.setState({pastCombined})
  }

  getPastCombined(value) {
    let data = this.state.data
    let scores = []
    let limit = new Date(moment().subtract(value || 7, 'days'))

    _.each(data, function(datum) {
      if(datum.date <= limit) {
        scores.push(datum.score)
      }
    })

    let sum = scores.reduce((a, b) => a + b, 0)
    let avg = parseFloat((sum/scores.length).toFixed(2))

    return avg || 0
  }

  setGraphs() {
    let categories = this.state.categories
    let graphs = []
    let that = this
    if(this.state.combine) {
      graphs.push({
        id: "g1",
        balloonText: "Combined: [[value]]%",
        valueField: "score",
        labelText: "[[value]]%",
        type: this.state.type,
        fillAlphas: this.state.type === 'column' ? 1 : 0,
        bullet: that.state.type === 'smoothedLine' ? 'round' : 'none',
        lineThickness: 2,
        bulletBorderAlpha: 1,
        bulletColor: "#FFFFFF",
        hideBulletsCount: 50,
        title: 'Combined Average: ',
        useLineColorForBulletBorder: true
      })
    }
    else {
      _.each(categories, function(category, i) {
        if(that.state[category]) {
          graphs.push({
            id: "g"+i,
            balloonText: _.capitalize(category)+": [[value]]%",
            valueField: category,
            type: that.state.type,
            lineThickness: 2,
            labelText: "[[value]]%",
            fillAlphas: that.state.type === 'column' ? 1 : 0,
            bullet: that.state.type === 'smoothedLine' ? 'round' : 'none',
            bulletBorderAlpha: 1,
            bulletColor: "#FFFFFF",
            hideBulletsCount: 50,
            title: _.capitalize(category)+': ',
            useLineColorForBulletBorder: true
          })
        }
      })
    }

    return graphs
  }

  handleCheckboxChange(e) {
    let option = {}, that = this

    option[e.target.name] = e.target.checked

    this.setChartOption(option, this.loadData)
  }

  setChunkedData(interval, data) {
    let chunkedData = _.groupBy(data || this.state.data, function (date) {
      return moment(date.completionTimestamp*1000).startOf(interval).format();
    })

    return chunkedData
  }

  setTimeline(e) {
    let days = parseInt(e.target.value, 10)

    this.setState({timeline: new Date(moment().subtract(days, 'days'))}, function() {
      this.loadData()
    })
  }

  loadData() {
    let that = this

    let data = this.state.allData.map( function(datum) {
      if(that.state[datum.type] && datum.date >= that.state.timeline) {
        return datum
      }
    })

    data = data.filter( function (n) { return n != undefined } )

    let chunkedData = this.setChunkedData(this.state.interval, data)

    let chartData = this.setChartData(chunkedData)

    let graphs = this.setGraphs()
    console.log(chartData);
    this.setState({data}, function() {
      let totals = this.calculateTotals()
      this.setState({chunkedData, chartData, graphs, totals}, function() {
        let pastCombined = this.getPastCombined()
        this.setState({pastCombined})
      })
    })
  }

  setChartData(chunkedData) {
    let that = this
    let chartData = _.map(chunkedData, function(datum, key) {
      let newDatum = {};

      // totals for chunk
      let sum = datum.map(function(d) {return d.score}).reduce((a, b) => a + b, 0)
      let avg = Math.floor(sum / datum.length)
      let categories = that.state.categories

      newDatum.score = avg
      newDatum.date = new Date(key)

      _.each(categories, function(category) {
        let catArr, catSum, catAvg

        catArr = datum.map(function(d) {
          if(d.type === category) {
            return d.score
          }
        })

        catArr = catArr.filter( function (n) { return n != undefined } )
        catSum = catArr.reduce((a, b) => a + b, 0)

        if(catSum > 0) {
          catAvg = Math.floor(catSum / catArr.length)
        }
        else {
          catAvg = null
        }

        newDatum[category] = catAvg
      })

      return newDatum
    });

    return chartData
  }

  calculateTotals() {
    let data = this.state.data
    let totals = {
      prepositions: [],
      helping: [],
      linking: [],
      irregulars: [],
      pronouns_relative: [],
      pronouns_personal: [],
      pronouns_interrogative: [],
      pronouns_possesive: [],
      pronouns_reflexive: [],
      pronouns_demonstrative: [],
      pronouns_indefinite: [],
      all: []
    }
    let results = {}

    _.each(data, function(datum) {
      totals.all.push(datum.score)

      if(datum.type === 'prepositions') {
        totals.prepositions.push(datum.score)
      }
      else if(datum.type === 'linking') {
        totals.linking.push(datum.score)
      }
      else if(datum.type === 'helping') {
        totals.helping.push(datum.score)
      }
      else if(datum.type === 'irregulars') {
        totals.irregulars.push(datum.score)
      }
      else if(datum.type === 'pronouns_indefinite') {
        totals.pronouns_indefinite.push(datum.score)
      }
      else if(datum.type === 'pronouns_personal') {
        totals.pronouns_personal.push(datum.score)
      }
      else if(datum.type === 'pronouns_possesive') {
        totals.pronouns_possesive.push(datum.score)
      }
      else if(datum.type === 'pronouns_relative') {
        totals.pronouns_relative.push(datum.score)
      }
      else if(datum.type === 'pronouns_reflexive') {
        totals.pronouns_reflexive.push(datum.score)
      }
      else if(datum.type === 'pronouns_demonstrative') {
        totals.pronouns_demonstrative.push(datum.score)
      }
      else if(datum.type === 'pronouns_interrogative') {
        totals.pronouns_interrogative.push(datum.score)
      }
    })

    results.totalHelping = totals.helping.length
    results.totalLinking = totals.linking.length
    results.totalIrregulars = totals.irregulars.length
    results.totalPrepositions = totals.prepositions.length
    results.totalPronounsRelative = totals.pronouns_relative.length
    results.totalPronounsPersonal = totals.pronouns_personal.length
    results.totalPronounsReflexive = totals.pronouns_reflexive.length
    results.totalPronounsPossesive = totals.pronouns_possesive.length
    results.totalPronounsIndefinite = totals.pronouns_indefinite.length
    results.totalPronounsDemonstrative = totals.pronouns_demonstrative.length
    results.totalPronounsInterrogative = totals.pronouns_interrogative.length
    results.totals = totals.all.length

    results.totalAvgHelping = parseFloat((totals.helping.reduce((a, b) => a + b, 0)
      / results.totalHelping).toFixed(2))
    results.totalAvgLinking = parseFloat((totals.linking.reduce((a, b) => a + b, 0)
      / results.totalLinking).toFixed(2))
    results.totalAvgIrregulars = parseFloat((totals.irregulars.reduce((a, b) => a + b, 0)
      / results.totalIrregulars).toFixed(2))
    results.totalAvgPrepositions = parseFloat((totals.prepositions.reduce((a, b) => a + b, 0)
      / results.totalPrepositions).toFixed(2))
    results.totalAvgPronounsRelative = parseFloat((totals.pronouns_relative.reduce((a, b) => a + b, 0)
      / results.totalPronounsRelative).toFixed(2))
    results.totalAvgPronounsDemonstrative= parseFloat((totals.pronouns_demonstrative.reduce((a, b) => a + b, 0)
      / results.totalPronounsDemonstrative).toFixed(2))
    results.totalAvgPronounsIndefinite = parseFloat((totals.pronouns_indefinite.reduce((a, b) => a + b, 0)
      / results.totalPronounsIndefinite).toFixed(2))
    results.totalAvgPronounsInterrogative = parseFloat((totals.pronouns_interrogative.reduce((a, b) => a + b, 0)
      / results.totalPronounsInterrogative).toFixed(2))
    results.totalAvgPronounsPersonal = parseFloat((totals.pronouns_personal.reduce((a, b) => a + b, 0)
      / results.totalPronounsPersonal).toFixed(2))
    results.totalAvgPronounsPossesive = parseFloat((totals.pronouns_possesive.reduce((a, b) => a + b, 0)
      / results.totalPronounsPossesive).toFixed(2))
    results.totalAvgPronounsReflexive = parseFloat((totals.pronouns_reflexive.reduce((a, b) => a + b, 0)
      / results.totalPronounsReflexive).toFixed(2))
    results.totalsAvg = parseFloat((totals.all.reduce((a, b) => a + b, 0)
      / results.totals).toFixed(2))

    for(let r in results) {
      if(!results[r]) {
        results[r] = 0
      }
    }

    return results
  }

  groupByInterval(e) {
    let interval = e.target.value, minPeriod
    let chunkedData = this.setChunkedData(interval)

    let chartData = this.setChartData(chunkedData)

    switch(interval) {
      case 'hour':
        minPeriod = 'hh'
        break
      case 'day':
        minPeriod = 'DD'
        break
      case 'week':
        minPeriod = '7DD'
        break
      case 'month':
        minPeriod = 'MM'
        break
    }

    this.setState({ interval, chunkedData, chartData, minPeriod })
  }

  getAvgPerDay() {
    if(this.state.data.length) {
      let a = moment(this.state.data[0].date);
      let b = moment(this.state.data[this.state.data.length-1].date);
      let days = b.diff(a, 'days')+1;

      let avg = parseFloat((this.state.data.length/days).toFixed(1))

      if(avg === 1) {
        avg = '1 test'
      }
      else {
        avg = avg + ' tests'
      }

      return avg
    }
    else {
      return '0 tests'
    }
  }

  setChartOption(option, cb) {
    this.setState(Object.assign({}, option), function() {
      if(typeof cb === 'function') cb()
    })
  }

  componentWillMount() {
    let variables = {userID : this.props.profile.email}
    let query =  `
    	query getResults($userID: String!) {
    	  results(userID: $userID) {
      		score
          type
          completionTimestamp
    	  }
    	}
      `;

    axios.post('/api/getresults', {
  	   query, variables
  	}).then((result) => {
      let data = result.data.data.results

      if(data.length) {
        for(let i = 0; i < data.length; i++ ) {
          data[i].date = new Date(data[i].completionTimestamp*1000)
        }
      }
      // set initial data
      this.setState({data: data, allData: data}, function() {
        this.loadData()
      })
  	});
  }

  render() {
    if (this.state.data) {
      return (
        <div>
          <PanelContainer noOverflow>
            <Panel>
              <PanelBody>
                <Grid>
                  <Row>
                    <Col xs={12}>
                    <h2>Welcome to your <span className="text-blue">Dashboard</span>, {this.props.profile.given_name}!</h2>
                    <h3 className="text-lighter">Below you can find your <span className="text-green">stats</span>.
                      Our robust chart will give you an insight to your <span className="text-orange">progress and results</span>.
                      Play around with the settings and find areas where you can <span className="text-green">improve!</span> </h3>
                    <hr></hr>
                    </Col>
                  </Row>
                  <Row>
                    <Col xs={12}>
                      <Col xs={6} componentClass={ControlLabel}><h4>Display Period:</h4>
                        <FormGroup controlId='largeselect' bsSize='large'>
                          <FormControl style={{fontWeight: 300}} defaultValue="31" onChange={this.setTimeline} componentClass='select'>
                            <option value="7">Last 7 Days</option>
                            <option value="31">Last 31 Days</option>
                            <option value="93">Last 3 Months</option>
                            <option value="365">Last Year</option>
                            <option value="10000">Max</option>
                          </FormControl>
                        </FormGroup>
                      </Col>
                      <Col xs={6} componentClass={ControlLabel}><h4>Average Results:</h4>
                        <div className="combinedAvg">Combined Average:&nbsp;
                          <span className="avgResult">{this.state.totals.totalsAvg}%</span>&nbsp;<br />
                          <div className="past-combined-text">(was <b>{this.state.pastCombined}%</b> one&nbsp;
                          <FormControl defaultValue="7" name="type" onChange={this.selectPastCombined} className="past-combined" componentClass='select'>
                            <option value="1">day</option>
                            <option value="7">week</option>
                            <option value="31">month</option>
                            <option value="365">year</option>
                          </FormControl> ago)</div>
                        </div>
                        <div className="detailsAvgContainer">
                          <span className="detailsAvg">Prepositions:&nbsp;
                            <span className="avgResult">{this.state.totals.totalAvgPrepositions}%</span>,&nbsp;
                          </span>
                          <span className="detailsAvg">Irregular:&nbsp;
                            <span className="avgResult">{this.state.totals.totalAvgIrregulars}%</span>,&nbsp;
                          </span>
                          <span className="detailsAvg">Linking:&nbsp;
                            <span className="avgResult">{this.state.totals.totalAvgLinking}%</span>,&nbsp;
                          </span>
                          <span className="detailsAvg">Helping:&nbsp;
                            <span className="avgResult">{this.state.totals.totalAvgHelping}%</span>,&nbsp;
                          </span>
                          <span className="detailsAvg">Personal:&nbsp;
                            <span className="avgResult">{this.state.totals.totalAvgPronounsPersonal}%</span>,&nbsp;
                          </span>
                          <span className="detailsAvg">Reflexive:&nbsp;
                            <span className="avgResult">{this.state.totals.totalAvgPronounsReflexive}%</span>,&nbsp;
                          </span>
                          <span className="detailsAvg">Possesive:&nbsp;
                            <span className="avgResult">{this.state.totals.totalAvgPronounsPossesive}%</span>,&nbsp;
                          </span>
                          <span className="detailsAvg">Interrogative:&nbsp;
                            <span className="avgResult">{this.state.totals.totalAvgPronounsInterrogative}%</span>,&nbsp;
                          </span>
                          <span className="detailsAvg">Indefinite:&nbsp;
                            <span className="avgResult">{this.state.totals.totalAvgPronounsIndefinite}%</span>,&nbsp;
                          </span>
                          <span className="detailsAvg">Demonstrative:&nbsp;
                            <span className="avgResult">{this.state.totals.totalAvgPronounsDemonstrative}%</span>,&nbsp;
                          </span>
                          <span className="detailsAvg">Relative:&nbsp;
                            <span className="avgResult">{this.state.totals.totalAvgPronounsRelative}%</span>
                          </span>
                        </div>
                      </Col>
                    </Col>
                  </Row>
                  <hr></hr>
                  <Row>
                    <Col xs={12}>
                      {<TestsTable data={this.state.data}></TestsTable>}
                    </Col>
                  </Row>
                  <Row>
                    <Form horizontal>
                      <Col xs={12}>
                        <FormGroup controlId='inline-checkboxes'>
                          <Col sm={2} componentClass={ControlLabel}>Toggle:</Col>
                          <Col sm={8}>
                            <Checkbox inline onChange={this.handleCheckboxChange} defaultChecked
                              name='prepositions'>
                              Prepositions
                            </Checkbox>
                            <Checkbox inline onChange={this.handleCheckboxChange} defaultChecked
                              name='irregulars'>
                              Irregular Verbs
                            </Checkbox>
                            <Checkbox inline onChange={this.handleCheckboxChange} defaultChecked
                              name='linking'>
                              Linking Verbs
                            </Checkbox>
                            <Checkbox inline onChange={this.handleCheckboxChange} defaultChecked
                              name='helping'>
                              Helping Verbs
                            </Checkbox>
                            <Checkbox inline onChange={this.handleCheckboxChange} defaultChecked
                              name='pronouns_personal'>
                              Pronouns Personal
                            </Checkbox>
                            <Checkbox inline onChange={this.handleCheckboxChange} defaultChecked
                              name='pronouns_relative'>
                              Pronouns Relative
                            </Checkbox>
                            <Checkbox inline onChange={this.handleCheckboxChange} defaultChecked
                              name='pronouns_reflexive'>
                              Pronouns Reflexive
                            </Checkbox>
                            <Checkbox inline onChange={this.handleCheckboxChange} defaultChecked
                              name='pronouns_possesive'>
                              Pronouns Possesive
                            </Checkbox>
                            <Checkbox inline onChange={this.handleCheckboxChange} defaultChecked
                              name='pronouns_indefinite'>
                              Pronouns Indefinite
                            </Checkbox>
                            <Checkbox inline onChange={this.handleCheckboxChange} defaultChecked
                              name='pronouns_interrogative'>
                              Pronouns Interrogative
                            </Checkbox>
                            <Checkbox inline onChange={this.handleCheckboxChange} defaultChecked
                              name='pronouns_demonstrative'>
                              Pronouns Demonstrative
                            </Checkbox>
                          </Col>
                          <Col sm={2}>
                            <Checkbox inline onChange={this.handleCheckboxChange} defaultChecked
                              name='combine'>
                              Combine
                            </Checkbox>
                          </Col>
                        </FormGroup>
                      </Col>
                    </Form>
                  </Row>
                  <Row>
                    <Col sm={12} style={{height:600}}>
                      <AmCharts
                        path="/public/js/amcharts3/amcharts"
                        type="serial"
                        theme="light"
                        fillAlphas={1}
                        graphs={this.state.graphs}
                        chartScrollbar={{
                          "autoGridCount": true,
                          "graph": "g1",
                          "scrollbarHeight": 40
                        }}
                        dataProvider={this.state.chartData}
                        valueAxes={[{
                          "axisAlpha": 0.2,
                          "dashLength": 1,
                          "unit": "%",
                          "minimum": 0,
                          "maximum": 100,
                          "position": "left",
                          "title": "Results"
                        }]}
                        legend={{
                          position: 'bottom',
                          labelText: '[[title]]',
                          valueText: '[[value]]%'
                        }}
                        mouseWheelZoomEnabled={true}
                        startDuration={0.15}
                        chartCursor={{
                          "limitToGraph":"g1"
                        }}
                        categoryField={this.state.categoryField}
                        categoryAxis={{
                          "minPeriod": this.state.minPeriod,
                          "parseDates": this.state.parseDates,
                          "axisColor": "#DADADA",
                          "dashLength": 1,
                          "minorGridEnabled": true
                        }}
                        export={{
                          "enabled": true
                        }}
                        />
                    </Col>
                  </Row>
                  <Row>
                    <Form horizontal>
                      <Col xs={6}>
                        <FormGroup controlId='largeselect'>
                          <Col sm={3} componentClass={ControlLabel}>Chart Type:</Col>
                          <Col sm={9}>
                            <FormControl name="type" defaultValue="smoothedLine" onChange={this.handleSelectChange} componentClass='select'>
                              <option value="line">Hard Line</option>
                              <option value="smoothedLine">Smooth Line</option>
                              <option value="column">Column</option>
                            </FormControl>
                          </Col>
                        </FormGroup>
                      </Col>
                      <Col xs={6}>
                        <FormGroup controlId='largeselect'>
                          <Col sm={3} componentClass={ControlLabel}>Interval:</Col>
                          <Col sm={9}>
                            <FormControl defaultValue="week" onChange={this.groupByInterval} componentClass='select'>
                              <option value="hour">Hour</option>
                              <option value="day">Day</option>
                              <option value="week">Week</option>
                              <option value="month">Month</option>
                            </FormControl>
                          </Col>
                        </FormGroup>
                      </Col>
                    </Form>
                  </Row>
                  <Row>
                    <Col xs={6}>
                      <h3 className="text-lighter">You've completed <span className="text-blue">{this.state.totals.totals} tests in total!</span></h3>
                      <span className="text-h4 text-lighter">... <span className="text-brown">{this.state.totals.totalPrepositions}</span> preposition tests, </span>
                      <span className="text-h4 text-lighter"><span className="text-green">{this.state.totals.totalIrregulars}</span> irregular verb tests, </span>
                      <span className="text-h4 text-lighter"><span className="text-purple">{this.state.totals.totalLinking}</span> linking verb tests, </span>
                      <span className="text-h4 text-lighter"><span className="text-orange">{this.state.totals.totalHelping}</span> helping verb tests, </span>
                      <span className="text-h4 text-lighter"><span className="text-green">{this.state.totals.totalPronounsPersonal}</span> personal pronouns tests, </span>
                      <span className="text-h4 text-lighter"><span className="text-brown">{this.state.totals.totalPronounsPossesive}</span> possesive pronouns tests, </span>
                      <span className="text-h4 text-lighter"><span className="text-purple">{this.state.totals.totalPronounsIndefinite}</span> indefinite pronouns tests, </span>
                      <span className="text-h4 text-lighter"><span className="text-orange">{this.state.totals.totalPronounsInterrogative}</span> interrogative pronouns tests, </span>
                      <span className="text-h4 text-lighter"><span className="text-blue">{this.state.totals.totalPronounsDemonstrative}</span> demonstrative pronouns tests, </span>
                      <span className="text-h4 text-lighter"><span className="text-purple">{this.state.totals.totalPronounsRelative}</span> relative pronouns tests, </span>
                      <span className="text-h4 text-lighter"><span className="text-green">{this.state.totals.totalPronounsReflexive}</span> reflexive pronouns tests...</span>
                    </Col>
                    <Col xs={6}>
                      <h1 className="text-lightest avg-per-day">
                        That's roughly <span className="text-green"><b>{this.getAvgPerDay()}</b></span> per day! Think you can improve it?...
                      </h1>
                    </Col>
                    <Col xs={12}>
                      <hr></hr>
                      <h3>Stay tuned! Keep in mind that this is an early alpha version and a ton of features have not been yet implemented</h3>
                      <h3>Features to come:</h3>
                      <ul>
                        <li>auto generate personalized tests</li>
                        <li>leveling and badging system</li>
                        <li>better social integration (see how your friends are doing)</li>
                        <li>machine learning your language weak points and generating unique learning paths to help you master your language</li>
                        <li>iOS and Android apps</li>
                      </ul>
                    </Col>
                  </Row>
                </Grid>
              </PanelBody>
            </Panel>
          </PanelContainer>
        </div>
        )
      }
      return (
        <div>
          <PanelContainer noOverflow>
            <Panel>
              <PanelBody>
                <Row>
                  <Col xs={12}>
                    <h1 style={{textAlign: 'center', paddingBottom:30}}>Loading your data... <span className="icon-ikons-loading rubix-icon"></span></h1>
                  </Col>
                </Row>
              </PanelBody>
            </Panel>
          </PanelContainer>
        </div>
      )
  }
}

function mapStateToProps(state) {
  const { profile } = state.auth
  const { userResults } = state.tests
  return { profile };
}

export default connect(mapStateToProps, {
  getResults
})(Dashboard)
