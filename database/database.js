exports.getResult = getResult;
exports.getResults = getResults;
exports.saveResult = saveResult;

var promisedMongo = require('promised-mongo');

var db = promisedMongo('mongodb://139.162.43.212/rheaenglish', ['results']);

function getResult(_id) {
  return db.results.findOne({ _id: promisedMongo.ObjectId(_id) });
}

function getResults(userID) {
  db.results.ensureIndex({completionTimestamp: 1});
  let results = db.results.find({userID:userID}).sort({completionTimestamp: 1})

  return results;
}

function saveResult(hash, score, userID, type, points, avgTimePerAnswer) {
  var datetime = new Date();
  return db.results.insert({
    completionDate: datetime,
    completionTimestamp: parseInt((datetime.getTime() / 1000).toFixed(0), 10),
    hash, score, userID, type, points, avgTimePerAnswer
  });
}
