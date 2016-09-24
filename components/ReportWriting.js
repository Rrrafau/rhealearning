import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import moment from 'moment'
import datapackets from '../datapackets/datapackets'
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

export default class ReportWriting extends Component {
  constructor() {
    super()
    this.generateReportData = this.generateReportData.bind(this)
    this.state = {
      data: 0
    }
  }
  getRandomInt(min, max) {
      return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  getInterval() {
    let intervals = [
      {type: 'month', count: 1},
      {type: 'year', count: 1},
      {type: 'year', count: 1},
      {type: 'year', count: 5},
      {type: 'year', count: 10}
    ]

    return intervals[this.getRandomInt(0, 3)]
  }

  formulae() {
    return {
      rising: function() { return 0 },
      falling: function() { return 0 },
      fluctuating: function() { return 0 },
      steady: function() { return 0 },
      plunging: function() { return 0 },
      surging: function() { return 0 },
    }
  }

  generateReportData() {
    let interval = this.getInterval()
    let steps = this.getRandomInt(3, 12)
    let endDate = moment().subtract(1, 'year')
    let startDate = moment().subtract(1, 'year')
    let minDate = interval.type
    let dates = []
    let dataProvider = []
    let dataSources = this.getRandomInt(3, 5)

    startDate.subtract(interval.count*steps, interval.type)

    for(let i = 0; i < steps; i++) {
      let newDate = moment(startDate).add(interval.count*i, interval.type)

      dates.push(newDate)
    }

    _.each(dates, function(date) {
      dataProvider.push({date: new Date(date)})
    })

    console.log(datapackets)
  }

  render() {
    return (
      <PanelContainer>
        <Panel>
          <PanelBody>
            <Grid>
              <Row>
                <Col xs={12}>
                  <Button onClick={this.generateReportData}>Generate Report</Button>
                  {this.state.data}
                </Col>
              </Row>
            </Grid>
          </PanelBody>
        </Panel>
      </PanelContainer>
    )
  }
}
