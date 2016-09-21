import * as ActionTypes from '../actions'
import { routerReducer as routing } from 'react-router-redux'
import { combineReducers } from 'redux'

let browserStorage = typeof localStorage === 'undefined' ? null : localStorage

const jwtDecode = require('jwt-decode')
const initialState = {
  isAuthenticated: checkTokenExpiry(),
  profile: getProfile(),
  error: '',
  slides: [],
  wordPacket: '',
  rawText: '',
  hintsUsed: 0,
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


function prepareResults(slides) {
  let results = {
    total: 0,
    wrong: 0,
    right: 0,
    correct: [],
    incorrect: [],
    percentage: 0
  }

  for(let key in slides) {
    for(let i = 0; i < slides[key].length; i++) {
      if(slides[key][i].hidden) {
        results.total++;

        if(slides[key][i].answer.toLowerCase() === slides[key][i].word.toLowerCase()) {
          results.right++;
          results.correct.push(Object.assign([], slides[key]));
        }
        else {
          results.wrong++;
          results.incorrect.push(Object.assign([], slides[key]));
        }
      }
    }
  }

  if(results.right > 0 && results.total > 0) {
    results.score = Math.floor(1*(results.right/results.total)*100)
  }

  return results;
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
        let results = prepareResults(Object.assign({}, state.slides))
        return Object.assign({}, state, {
          results: results
        })
    case ActionTypes.TYPE_TEST_ANSWER:
      slides[parseInt(action.answer.question, 10)][parseInt(action.answer.key, 10)].typing = action.answer.answer.toLowerCase()

      return Object.assign({}, state, {
        slides: slides
      })
    case ActionTypes.CREATE_TEST_SLIDES:
      return Object.assign({}, state, {
        slides: action.slides,
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
