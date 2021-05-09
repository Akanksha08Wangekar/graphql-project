const graphql = require('graphql');

const {
    GraphQLSchema,
    GraphQLObjectType,
    GraphQLString,
    GraphQLID,
    GraphQLInt,
    GraphQLFloat,
    GraphQLBoolean,
    GraphQLNonNull
} = graphql

const Person = new GraphQLObjectType({
    name: 'Person',
    description: 'Returns the information about person',
    fields: () => ({

        //Scalar Type
        id: {type: GraphQLID},
        name: {type: new GraphQLNonNull(GraphQLString)},
        age: {type: GraphQLInt},
        isMaried: {type: GraphQLBoolean},
        gpa: {type: GraphQLFloat},

        //Oject Type
        justAtype: {
            type: Person,
            resolve(parent, args){
                return parent;
            }
        }
    })
})

const RootQuery = new GraphQLObjectType({
    name: 'RootQueryType',
    description: 'Description',
    fields: () => ({
        person:{
            type: Person,
            args: {id: {type: GraphQLID}},

            resolve(parent, args){
                let personObject = {
                    id: 1,
                    name: 'Akanksha',
                    age: 20,
                    isMaried: false,
                    gpa: 8.2
                }
                return personObject;
            }
        }
    })
})

module.exports = new graphql.GraphQLSchema({
    query: RootQuery
})