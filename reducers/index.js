import * as ActionTypes from '../actions'
import { routerReducer as routing } from 'react-router-redux'
import { combineReducers } from 'redux'
import _ from 'lodash'
import moment from 'moment'

let browserStorage = typeof localStorage === 'undefined' ? null : localStorage

const jwtDecode = require('jwt-decode')
const initialState = {
  isAuthenticated: checkTokenExpiry(),
  profile: getProfile(),
  error: '',
  slides: [],
  wordPacket: '',
  rawText: '',
  timeStart: null,
  timeEnd: null,
  hintsUsed: 0,
  avgTimePerAnswer: 0,
  points: 0,
  results: {
    wrong: 0,
    right: 0,
    correct: [],
    incorrect: [],
    score: 0
  }
}

function checkTokenExpiry() {
  if(browserStorage) {
    let jwt = localStorage.getItem('id_token')
    if(jwt) {
      let jwtExp = jwtDecode(jwt).exp;
      let expiryDate = new Date(0);
      expiryDate.setUTCSeconds(jwtExp);

      if(new Date() < expiryDate) {
        return true;
      }
    }
    return false;
  }
  else {
    return false;
  }
}

function getProfile() {
  if(browserStorage) {
    return JSON.parse(localStorage.getItem('profile'));
  }
  else {
    return {}
  }
}


function prepareResults(slides, state) {
  let results = {
    total: 0,
    wrong: 0,
    right: 0,
    correct: [],
    incorrect: [],
    percentage: 0
  }

  let points = 0
  let questions = 0
  let answers = []

  for(let key in slides) {
    for(let i = 0; i < slides[key].length; i++) {
      if(slides[key][i].hidden) {
        results.total++;
        answers.push(slides[key][i].word.toLowerCase())

        if(slides[key][i].answer.toLowerCase() === slides[key][i].word.toLowerCase()) {
          results.right++;
          results.correct.push(Object.assign([], slides[key]));
          points+=5
        }
        else {
          results.wrong++;
          results.incorrect.push(Object.assign([], slides[key]));
          points-=2
        }
      }
    }
  }

  let wordCount = 0;

  _.each(slides, function(slide) {
    wordCount += slide.length
  })

  let start = moment(state.timeStart);
  let end = moment(new Date());

  let time = end.diff(start, 'seconds')

  points = wordCount + results.total*7

  if(time > (results.total*7)) { points-=(time-((results.total*3.5)*2)) }

  points = points*((results.right/results.total))
  points = points < 0 ? 0 : points;

  answers = _.uniq(answers)

  let rightAnswers = _.uniq(results.right)

  if(results.right > 0) {
    points = points+(points*(answers.length/4))
    points = points+(points*(rightAnswers.length/2))
  }

  let avgTimePerAnswer = (time/results.total)+((results.wrong*7/results.total))

  avgTimePerAnswer = parseFloat(avgTimePerAnswer.toFixed(2))
  points = parseInt(points, 10)
  
  if(results.right > 0 && results.total > 0) {
    results.score = Math.floor(1*(results.right/results.total)*100)
  }

  return {results, avgTimePerAnswer, points};
}

function cleanText(text) {
  // remove wiki annotations
  return text.replace(/\[[1-9a-z]\]/ig, '')
}

function tests(state = initialState, action) {
  let slides = Object.assign([], state.slides);
  switch (action.type) {
    case ActionTypes.SET_RAW_TEXT_VALUE:
      return Object.assign({}, state, {
        rawText: cleanText(action.rawText),
        wordPacket: ''
      })
    case ActionTypes.SUBMIT_TEST_ANSWER:
      for(let key in slides) {
        for(let k = 0; k < slides[key].length; k++) {
          slides[key][k].answer = slides[key][k].typing ? slides[key][k].typing.toLowerCase() : ''
        }
      }
      return Object.assign({}, state, {
        slides: slides
      })
      case ActionTypes.PREPARE_RESULTS:
        let results = prepareResults(Object.assign({}, state.slides), state)
        console.log(results)
        return Object.assign({}, state, {
          results: results.results,
          points: results.points,
          avgTimePerAnswer: results.avgTimePerAnswer
        })
    case ActionTypes.TYPE_TEST_ANSWER:
      slides[parseInt(action.answer.question, 10)][parseInt(action.answer.key, 10)].typing = action.answer.answer.toLowerCase()

      return Object.assign({}, state, {
        slides: slides
      })
    case ActionTypes.CREATE_TEST_SLIDES:
      return Object.assign({}, state, {
        slides: action.slides,
        timeStart: new Date(),
        wordPacket: action.wordPacket
      })
    case ActionTypes.ALL_RESULTS:
      for(let i = 0; i < action.result.length; i++ ) {
        action.result[i].date = new Date(action.result[i].completionTimestamp*1000)
      }
  	  return Object.assign({}, state, {
  		  userResults: action.result
  	  })
  	case ActionTypes.SAVE_RESULT:
  	  return Object.assign({}, state, {})
    default:
      return state
    }
}

function auth(state = initialState, action) {
  switch (action.type) {
    case ActionTypes.LOGIN_SUCCESS:
      return Object.assign({}, state, {
        isAuthenticated: true,
        profile: action.profile,
        error: ''
      })
    case ActionTypes.LOGIN_ERROR:
      return Object.assign({}, state, {
        isAuthenticated: false,
        profile: null,
        error: action.error
      })
    case ActionTypes.LOGOUT_SUCCESS:
      return Object.assign({}, state, {
        isAuthenticated: false,
        profile: null
      })
    default:
      return state
    }
}

const rootReducer = combineReducers({
  routing,
  tests,
  auth,
})

export default rootReducer
