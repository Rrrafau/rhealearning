import { CALL_API } from '../middleware/api'

import axios from 'axios';

// let GraphQLEndpoint = 'http://rheaenglish.com/api'
let GraphQLEndpoint = 'http://localhost:3000/api'
export const ALL_RESULTS = 'ALL_RESULTS'
export const SAVE_RESULT = 'SAVE_RESULT'

export function getResults(variables) {
  let query = `
  	query getResults($userID: String!) {
  	  results(userID: $userID) {
    		score
        type
        completionTimestamp
  	  }
  	}
    `;

  return dispatch => {
  	return axios.post(GraphQLEndpoint, {
  	  query,
      variables
  	}).then((result) => {
  	  if (result.data.errors) {
    		dispatch({
    		  type: ALL_RESULTS,
    		  error: result.data.errors,
    		})
    		return;
  	  }

  	  dispatch({
    		type: ALL_RESULTS,
    		result: result.data.data.results,
  	  });
  	});
  };
}

export function saveResult(variables) {
  let query = `
	mutation saveResultMutation(
    $hash: String!
    $userID: String!
    $score: Int!
    $type: String!
    $points: Int!
    $avgTimePerAnswer: Float!
  ) {
	  saveResult(
      hash: $hash
      userID: $userID
      score: $score
      type: $type
      points: $points
      avgTimePerAnswer: $avgTimePerAnswer
    ) {
  		_id
      userID
      score
      hash
      type
      points
      avgTimePerAnswer
	  }
	}
  `;

  return dispatch => {
  	return axios.post(GraphQLEndpoint, {
  	  query,
  	  variables,
  	}).then((result) => {
  	  if (result.data.errors) {
  		dispatch({
  		  type: SAVE_RESULT,
  		  error: result.data.errors,
  		})
  		  return;
  	  }
  	  dispatch({
    		type: SAVE_RESULT,
    		result: result.data.data.saveResult,
  	  });
  	});
  };
}

export const LOGIN_SUCCESS = 'LOGIN_SUCCESS'
export const LOGIN_ERROR = 'LOGIN_ERROR'

function loginSuccess(profile) {
  return {
    type: LOGIN_SUCCESS,
    profile
  }
}

function loginError(error) {
  return {
    type: LOGIN_ERROR,
    error
  }
}

export function login() {
  const lock = new Auth0Lock('yGk6tt6KKPXlKcCPNXai1u201eSr987n', 'rafalrad.auth0.com')
  return dispatch => {
    lock.show((error, profile, token) => {
      if(error) {
        return dispatch(loginError(error))
      }
      localStorage.setItem('profile', JSON.stringify(profile))
      localStorage.setItem('id_token', token)
      return dispatch(loginSuccess(profile))
    })
  }
}

export const LOGOUT_SUCCESS = 'LOGOUT_SUCCESS'

function logoutSuccess(profile) {
  return {
    type: LOGOUT_SUCCESS
  }
}

export function logout() {
  return dispatch => {
    localStorage.removeItem('id_token')
    localStorage.removeItem('profile')
    return dispatch(logoutSuccess())
  }
}

export const SET_RAW_TEXT_VALUE = 'SET_RAW_TEXT_VALUE'

function setTextValue(rawText) {
  return {
    type: SET_RAW_TEXT_VALUE,
    rawText
  }
}

export function setEntryTextValue(value) {
  return dispatch => {
    return dispatch(setTextValue(value))
  }
}

export const CREATE_TEST_SLIDES = 'CREATE_TEST_SLIDES'

function generateSlides(slides, wordPacket) {
  return {
    type: CREATE_TEST_SLIDES,
    slides,
    wordPacket
  }
}

export function createTestSlides(slides, wordPacket) {
  return dispatch => {
    return dispatch(generateSlides(slides, wordPacket))
  }
}

export const TYPE_TEST_ANSWER = 'TYPE_TEST_ANSWER'

function typeAnswer(answer) {
  return {
    type: 'TYPE_TEST_ANSWER',
    answer
  }
}

export function typeTestAnswer(answer) {
  return dispatch => {
    return dispatch(typeAnswer(answer))
  }
}

export const SUBMIT_TEST_ANSWER = 'SUBMIT_TEST_ANSWER'

function submitAnswers() {
  return {
    type: 'SUBMIT_TEST_ANSWER'
  }
}

export function submitTestAnswer() {
  return dispatch => {
    return dispatch(submitAnswers())
  }
}

export const PREPARE_RESULTS = 'PREPARE_RESULTS'

function prepareTestResults() {
  return {
    type: 'PREPARE_RESULTS'
  }
}

export function prepareResults() {
  return dispatch => {
    return dispatch(prepareTestResults())
  }
}
