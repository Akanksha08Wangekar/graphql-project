const graphql = require('graphql');
const {graphqlHTTP} = require('express-graphql');
var _ =  require('lodash');
const User = require('../model/user');
const Post = require('../model/post');
const Hobby = require('../model/hobby');
const cors = require('cors');
/*
var UserData = [
    {id: '1', name: 'Akanksha', age:22, profession: 'Student'},
    {id: '2', name: 'Amol', age:27, profession: 'Engineer'},
    {id: '3', name: 'shubham', age: 18, profession: 'Student'},
    {id: '4', name: 'Rahul', age: 30, profession: 'Employee'}
]

var HobbyData = [
    {id: '1', title: 'Programming', description: 'I love to do programming', userId: '2'},
    {id: '2', title: 'Teaching', description: 'I love spread knowledge', userId: '1'},
    {id: '3', title: 'Dancing', description: 'I love to dance and it makes me fresh', userId: '4'},
    {id: '4', title: 'Hangout', description: 'I like to visit different places', userId: '1'}
]

var PostData =[
    {id: '1', comment: 'Hello Welcome to programming World', userId: '1'},
    {id: '2', comment: 'Enjoy Coding..', userId: '3'},
    {id: '3', comment: 'Enjoy every moment', userId: '4'},
    {id: '4', comment: 'Good Luck', userId: '4'}
]
*/

const{
    GraphQLObjectType,
    GraphQLString,
    GraphQLInt,
    GraphQLID, 
    GraphQLList,
    GraphQLNonNull
} = graphql

const UserType = new GraphQLObjectType({
    name: 'User',
    description: 'Documentation for User...',
    fields: () => ({
        id: {type: new GraphQLNonNull(GraphQLID)},
        name: {type: new GraphQLNonNull(GraphQLString)},
        age: {type: new GraphQLNonNull(GraphQLInt)},
        profession: {type: GraphQLString},

        posts: {
            type: new GraphQLList(PostType),
            resolve(parent, args){
                //return _.filter(PostData, {userId: parent.id});
                return Post.find({});
            }
        },

        hobbies: {
            type: new GraphQLList(HobbyType),
            resolve(parent, args){
                //return _.filter(HobbyData, {userId: parent.id})
                return Hobby.find({}); 
            }
        }
        
    })
});

const HobbyType = new GraphQLObjectType({
    name: 'Hobby',
    description: 'Documentation regarding hobby..',
    fields: () =>({
        id: {type: new GraphQLNonNull(GraphQLID)},
        title: {type: new GraphQLNonNull(GraphQLString)},
        description: {type:new GraphQLNonNull(GraphQLString)},
        user: {
            type: UserType,
            resolve(parent, args){
                //return _.find(UserData, {id: parent.userId})
                return User.findById(parent.userId)
            }
        }
    })
});

const PostType = new GraphQLObjectType({
    name: 'Post',
    description: 'Documentation for post..',
    fields: () =>({
        id: {type: new GraphQLNonNull(GraphQLID)},
        comment: {type: new GraphQLNonNull(GraphQLString)},
        user: {
            type: UserType,
            resolve(parent, args){
                //return _.find(UserData, {id: parent.userId})
                return User.findById(parent.userId)
            }
        }
    })
});

const RootQuery = new GraphQLObjectType({
    name: 'RootQueryType',
    description: 'Description',
    fields: {

        user:{
            type: UserType,
            args: {id: {type: GraphQLID}},

            resolve(parent, args){
                //we resolve with data
                //get and return data from a database
                //parent = userType 
                /*let user = {
                    id: '123',
                    age: 34,
                    name: 'Akanksha'
                }
                return user;*/
                //return _.find(UserData, {id: args.id})

                return User.findById(args.id);

           }   },

           users: {
               type: new GraphQLList(UserType),
               resolve(parent, args){
                   //return UserData;
                   //return User.find({name: "Akanksha"});
                   return User.find({});
               }
           },

        hobby: {
            type: HobbyType,
            args: {id: {type: GraphQLID}},

            resolve(parent, args){
                //return _.find(HobbyData, {id: args.id})
                return Hobby.findById(args.id)
            }
        },

        hobbies: {
            type: new  GraphQLList(HobbyType),
            resolve(parent, args){
                //return HobbyData
                return Hobby.find({});
            }
        },

        post: {
            type: PostType,
            args: {id: {type: GraphQLID}},

            resolve(parent,args){
                //return _.find(PostData, {id: args.id})
                return Post.findById(args.id)
            }
        },
        
        posts: {
            type: new GraphQLList(PostType),
            resolve(parent, args){
                //return PostData
                return Post.find({})
            }
        }
    }
    })

//Mutation
const Mutation = new GraphQLObjectType({
    name: 'Mutation',
    fields:{
        createUser:{
            type: UserType,
            args:{
                //id: {type: GraphQLID},
                name: {type: GraphQLString},
                age: {type: GraphQLInt},
                profession: {type: GraphQLString},
            },
            resolve(parent, args){
                let user = new User({
                    name: args.name,
                    age: args.age,
                    profession: args.profession
                })
                //return user;
                //Save to DB
                user.save();
                return user;
            }
            },

        UpdateUser: {
            type: UserType,
            args:{
                id: {type: new GraphQLNonNull(GraphQLString)},
                name: {type: new GraphQLNonNull(GraphQLString)},
                age: {type: GraphQLInt},
                profession: {type: GraphQLString}
            },
            resolve(parent, args){
                return updatedUser = User.findByIdAndUpdate(
                args.id,{
                    $set: {
                        name: args.name,
                        age: args.age,
                        profession: args.profession
                    }
                }, {new: true})
                
            }
        
        },

        RemoveUser:{
            type: UserType,
            args: {
                id: {type: new GraphQLNonNull(GraphQLString)}
            },
            resolve(parent, args){
                let removedUser = User.findByIdAndRemove(
                    args.id
            ).exec();

            if(!removedUser){
                throw new("Error");
            }
            return removedUser;
            }
        },

        createPost:{
            type: PostType,
            args:{
                //id: {type: GraphQLID},
                userId: {type: new GraphQLNonNull(GraphQLID)},
                comment: {type: new GraphQLNonNull(GraphQLString)}
            },
            resolve(parent, args){
                let post = new Post({
                    userId: args.userId,
                    comment: args.comment
                })
                //return post;
                post.save();
                return post;
            }
        },

        UpdatePost:{
            type: PostType,
            args: {
                id: {type: new GraphQLNonNull(GraphQLString)},
                // userId: {type: new GraphQLNonNull(GraphQLID)},
                comment: {type: new GraphQLNonNull(GraphQLString)}
            },
            resolve(parent, args){
                    return updatedPost = Post.findByIdAndUpdate(
                        args.id, {
                            $set: {
                                comment: args.comment,
                            }
                        }, {new: true}
                    )
            }

        },

        RemovePost:{
            type: PostType,
            args: {
                id: {type: new GraphQLNonNull(GraphQLString)}
            },
            resolve(parent, args){
                let removedPost = User.findByIdAndRemove(
                    args.id
            ).exec();

            if(!removedPost){
                throw new("Error");
            }
            return removedPost;
            }
        },

        createHobby:{
            type: HobbyType,
            args: {
                //id: {type: GraphQLID},
                title: {type: new GraphQLNonNull(GraphQLString)},
                description: {type: new GraphQLNonNull(GraphQLString)},
                userId: {type: GraphQLID}
            },

            resolve(parent,args){
                let hobby = new Hobby({
                    title: args.title,
                    description: args.description,
                    userId: args.userId
                })
                //return hobby;
                hobby.save();
                return hobby;
            }
        },

        UdateHobby:{
            type: HobbyType,
            args: {
                id: {type: new GraphQLNonNull(GraphQLString)},
                title: {type: new GraphQLNonNull(GraphQLString)},
                description: {type: new GraphQLNonNull(GraphQLString)}
                //userId: {type: GraphQLID}
            },

            resolve(parent, args){
                return updatedHobby = Hobby.findByIdAndUpdate(
                    args.id, {
                        $set: {
                            title: args.title,
                            description: args.description
                        }
                    }, {new: true}
                )
            }
        },

        RemoveHobby:{
            type: HobbyType,
            args: {
                id: {type: new GraphQLNonNull(GraphQLString)}
            },
            resolve(parent, args){
                let removedHobby = User.findByIdAndRemove(
                    args.id,
            ).exec();

            if(!removedHobby){
                throw new("Error");
            }
            return removedHobby;
            }
        }

        }
})

module.exports = new graphql.GraphQLSchema({
    query: RootQuery,
    mutation: Mutation
})