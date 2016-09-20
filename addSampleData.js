const pmongo = require('promised-mongo');
const crypto = require('crypto');

const db = pmongo('mongodb://139.162.43.212/rheaenglish', ['results']);

types = ['irregulars', 'prepositions', 'linking', 'helping']

let results = [];

let getRandomInt = function(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

let randomDate = function(start, end) {
    return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
}

let i = 0;

function addRecord() {
  let result = {};
  let date = randomDate(new Date(2015, 0, 1), new Date())

  result['type'] = types[getRandomInt(0, 3)]
  result['score'] = getRandomInt(0, 100)
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
  db.results.drop().then(function() {
    addRecord()
  })
}

setup();
