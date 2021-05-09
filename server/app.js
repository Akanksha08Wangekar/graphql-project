const express = require('express') //Imports
//express-graphql returns the object that has a function inside it named 'graphqlHTTP'
const {graphqlHTTP} = require('express-graphql')
const graphql = require('graphql')
const mongoose = require('mongoose')
//const Schema =  require('./schema/schema')
const Schema = require('./schema/schema1')
const testSchema = require('./schema/types_schema')
const cors = require('cors');
const PORT = process.env.PORT || 4000;
//mongoose.set('useFindAndModify', false);
/*
    mongodb+srv://user1:root@course.ob1or.mongodb.net/myFirstDatabase?retryWrites=true&w=majority

*/
const app = express(); // Instantiation

mongoose.connect(process.env.MONGODB_URI || 'mongodb+srv://user1:root@course.ob1or.mongodb.net/myFirstDatabase?retryWrites=true&w=majority', 
{ useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify:false} ).then(() => {
    console.log("Connected")
})

app.use(cors());

//mongoose.connection.once('one', () => {
  //  console.log('Yes!!! Connected..')
//} )

//app.use allows us to serve/pass endpoint
app.use('/graphql', graphqlHTTP({
    graphiql: true,
    //schema: testSchema
    schema: Schema
}))

app.listen(PORT, "0.0.0.0", () => {
    console.log('Listening to port 4000....')
})
