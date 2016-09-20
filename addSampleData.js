const pmongo = require('promised-mongo');
const crypto = require('crypto');
const moment = require('moment');

const db = pmongo('mongodb://localhost/rheaenglish', ['results']);

types = [
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
]

let results = [];

let getRandomInt = function(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

let randomDate = function(start, end) {
    console.log(start, end)
    return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
}

let i = 0;

function addRecord() {
  let result = {};
  // let date = randomDate(new Date(2015, 0, 1), new Date())
  let date1 = moment().substract(333, 'days')
  date1.add(8*(i || 1), 'hours')

  let date2 = moment().substract(333, 'days')
  date2.add(8*(i+1), 'hours')

  let date = randomDate(new Date(date1), new Date(date2))

  result['type'] = types[getRandomInt(0, 10)]
  result['score'] = getRandomInt((50+i/50)-(i/100), ((50+i/50+10) > 100 ? 100 : (50+i/50+10))-(i/100))
  result['hash'] = crypto.createHash('md5').update(date.getTime().toString() + result['type']).digest("hex")
  result['userID'] = 'radolasd@gmail.com'
  result['completionTimestamp'] = parseInt((date.getTime() / 1000).toFixed(0), 10)
  result['completionDate'] = date

  db.results.update({hash: result['hash']}, {$set: result}, {upsert: true}).then( function() {
    i++
    if(i < 1000) {
      console.log('adding ', i);
      addRecord()
    }
    else {
      console.log('done');

      db.close();
    }
  });
}

function setup() {
  // db.results.drop().then(function() {
    addRecord()
  // })
}

setup();
