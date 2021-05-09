const {graphqlHTTP} = require('express-graphql');
const graphql = require('graphql');
const express = require('express');
const app = express();
//const { GraphQLInt, GraphQLSchema } = require('graphql');
//const { buildResolveInfo } = require('graphql/execution/execute');

const {
    
    GraphQLObjectType,
    GraphQLSchema,
    GraphQLString,
    GraphQLInt,
   
} = graphql 

const UserType = new GraphQLObjectType({
    name: 'User',
    description: 'Documentation for user...',
    fields: () => ({
        id: {type: GraphQLString},
        name: {type: GraphQLString},
        age: {type: GraphQLInt}
    })
});

//RootQuery
const RootQuery = new GraphQLObjectType({
    name: 'RootQueryType',
    description: 'Description',
    fields: {
        user:{
            type: UserType,
            args: {id: {type: GraphQLString}},

            resolve(parent, args){
                //we resolve with data
                //get and return data from a database
                //parent = userType 
            }
        }
    }
})

module.exports = new GraphQLSchema({
    query: RootQuery //here we have to specify what is the query that we passing on
})