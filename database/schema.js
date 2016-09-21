
var graphql = require('graphql');

var database = require('./database');

var resultType = new graphql.GraphQLObjectType({
  name: 'Result',
  fields:  {
    _id: {
      type: graphql.GraphQLString,
      resolve: function(_ref) {
        var _id = _ref._id;
        return _id;
      }
    },
    score: {
      type: graphql.GraphQLInt,
      resolve: function(_ref2) {
        var score = _ref2.score;
        return score;
      }
    },
    points: {
      type: graphql.GraphQLInt,
      resolve: function(_ref6) {
        var points = _ref6.points;
        return points;
      }
    },
    avgTimePerAnswer: {
      type: graphql.GraphQLFloat,
      resolve: function(_ref7) {
        var avgTimePerAnswer = _ref7.avgTimePerAnswer;
        return avgTimePerAnswer;
      }
    },
    hash: {
      type: graphql.GraphQLString,
      resolve: function(_ref3) {
        var hash = _ref3.hash;
        return hash;
      }
    },
    type: {
      type: graphql.GraphQLString,
      resolve: function(_ref4) {
        var type = _ref4.type;
        return type;
      }
    },
    completionTimestamp: {
      type: graphql.GraphQLInt,
      resolve: function(_ref3) {
        var completionTimestamp = _ref3.completionTimestamp;
        return completionTimestamp;
      }
    },
    userID: {
      type: graphql.GraphQLString,
      resolve: function(_ref5) {
        var userID = _ref5.userID;
        return userID;
      }
    }
  }
});

const queryType = new graphql.GraphQLObjectType({
  name: 'Query',
  fields: () => ({
    results: {
  	  type: new graphql.GraphQLList(resultType),
  	  args: {
    		userID: { type: new graphql.GraphQLNonNull(graphql.GraphQLString) },
    	},
  	  resolve: (_, { userID }) => database.getResults(userID),
  	},
  })
})

const mutationType = new graphql.GraphQLObjectType({
  name: 'Mutation',
  fields: () => ({
  	saveResult: {
  	  type: resultType,
  	  args: {
  		  hash: { type: new graphql.GraphQLNonNull(graphql.GraphQLString) },
        score: { type: new graphql.GraphQLNonNull(graphql.GraphQLInt)},
        userID: { type: new graphql.GraphQLNonNull(graphql.GraphQLString)},
        type: { type: new graphql.GraphQLNonNull(graphql.GraphQLString)},
        points: { type: new graphql.GraphQLNonNull(graphql.GraphQLInt)},
        avgTimePerAnswer: { type: new graphql.GraphQLNonNull(graphql.GraphQLFloat)},
  	  },
  	  resolve: (_, { hash, score, userID, type, points, avgTimePerAnswer }) =>
                  database.saveResult( hash, score, userID, type, points, avgTimePerAnswer ),
  	},
  })
})

module.exports = new graphql.GraphQLSchema({
  query: queryType,
  mutation: mutationType,
});
