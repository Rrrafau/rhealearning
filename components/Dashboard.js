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
      combine: false,
      graphs: [],
      totals: {
        totalAvgPrepositions: 0,
        totalPrepositions: 0,
        totalAvgIrregulars: 0,
        totalIrregulars: 0,
        totalAvgLinking: 0,
        totalLinking: 0,
        totalAvgHelping: 0,
        totalHelping: 0,
        categories: ['prepositions', 'linking', 'helping', 'irregulars']
      }
    }
  }

  handleSelectChange(e) {
    let option = {};

    option[e.target.name] = e.target.value

    this.setChartOption(option, this.loadData)
  }

  setGraphs() {
    let categories = ['prepositions', 'linking', 'helping', 'irregulars']
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

    this.setState({data}, function() {
      let totals = this.calculateTotals()
      this.setState({chunkedData, chartData, graphs, totals}, function() {
        console.log(this.state)
      })
    })
  }

  setChartData(chunkedData) {
    let chartData = _.map(chunkedData, function(datum, key) {
      let newDatum = {};

      // totals for chunk
      let sum = datum.map(function(d) {return d.score}).reduce((a, b) => a + b, 0)
      let avg = Math.floor(sum / datum.length)
      let categories = ['prepositions', 'linking', 'helping', 'irregulars']

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
    })

    results.totalHelping = totals.helping.length
    results.totalLinking = totals.linking.length
    results.totalIrregulars = totals.irregulars.length
    results.totalPrepositions = totals.prepositions.length
    results.totals = totals.all.length

    results.totalAvgHelping = Math.floor((totals.helping.reduce((a, b) => a + b, 0)
      / results.totalHelping))
    results.totalAvgLinking = Math.floor((totals.linking.reduce((a, b) => a + b, 0)
      / results.totalLinking))
    results.totalAvgIrregulars = Math.floor((totals.irregulars.reduce((a, b) => a + b, 0)
      / results.totalIrregulars))
    results.totalAvgPrepositions = Math.floor((totals.prepositions.reduce((a, b) => a + b, 0)
      / results.totalPrepositions))
    results.totalsAvg = Math.floor((totals.all.reduce((a, b) => a + b, 0)
      / results.totals))

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

  setChartOption(option, cb) {
    this.setState(option, function() {
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
      for(let i = 0; i < data.length; i++ ) {
        data[i].date = new Date(data[i].completionTimestamp*1000)
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
                      Below chart will give you an insight into your <span className="text-brown">progress and results</span>. Play around with it find
                      areas you could improve! </h3>
                    </Col>
                  </Row>
                  <Row>
                    <Col xs={12}>
                      <FormGroup controlId='largeselect'>
                        <Col xs={6} componentClass={ControlLabel}><h4>Show:</h4>
                          <FormControl defaultValue="31" onChange={this.setTimeline} componentClass='select'>
                            <option value="7">Last 7 Days</option>
                            <option selected value="31">Last 31 Days</option>
                            <option value="93">Last 3 Months</option>
                            <option value="365">Last Year</option>
                            <option value="10000">Max</option>
                          </FormControl>
                        </Col>
                        <Col xs={6}><h4>Average Results:</h4>
                          <div className="combinedAvg">Combined Average:&nbsp;
                            <span className="avgResult">{this.state.totals.totalsAvg}%</span>
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
                              <span className="avgResult">{this.state.totals.totalAvgHelping}%</span>
                            </span>
                          </div>
                        </Col>
                      </FormGroup>
                    </Col>
                  </Row>
                  <hr></hr>
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
                          </Col>
                          <Col sm={2}>
                            <Checkbox inline onChange={this.handleCheckboxChange}
                              name='combine'>
                              Combine
                            </Checkbox>
                          </Col>
                        </FormGroup>
                      </Col>
                    </Form>
                  </Row>
                  <Row>
                    <Col sm={12} style={{height:400}}>
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
                            <FormControl name="type" onChange={this.handleSelectChange} componentClass='select'>
                              <option value="line">Hard Line</option>
                              <option selected value="smoothedLine">Smooth Line</option>
                              <option value="column">Column</option>
                            </FormControl>
                          </Col>
                        </FormGroup>
                      </Col>
                      <Col xs={6}>
                        <FormGroup controlId='largeselect'>
                          <Col sm={3} componentClass={ControlLabel}>Interval:</Col>
                          <Col sm={9}>
                            <FormControl onChange={this.groupByInterval} componentClass='select'>
                              <option value="hour">Hour</option>
                              <option value="day">Day</option>
                              <option selected value="week">Week</option>
                              <option value="month">Month</option>
                            </FormControl>
                          </Col>
                        </FormGroup>
                      </Col>
                    </Form>
                  </Row>
                  <Row>
                    <Col xs={12}>
                      <h3 className="text-lighter">You've completed <span className="text-blue">{this.state.totals.totals} tests in total!</span></h3>
                      <h4 className="text-lighter">{this.state.totals.totalPrepositions} preposition tests!</h4>
                      <h4 className="text-lighter">{this.state.totals.totalIrregulars} irregular verb tests!</h4>
                      <h4 className="text-lighter">{this.state.totals.totalLinking} linking verb tests!</h4>
                      <h4 className="text-lighter">{this.state.totals.totalHelping} helping verb tests!</h4>
                      <hr></hr>
                    </Col>

                    <Col xs={12}>
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
                Loading...
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
