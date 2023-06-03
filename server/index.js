const { ApolloServer } = require('apollo-server')
const { PubSub } = require('graphql-subscriptions')
const mongoose = require('mongoose')

const typeDefs = require('./graphql/typeDefs')
const resolvers = require('./graphql/resolvers')
const { MONGODB } = require('./config.js')

const pubsub = new PubSub()

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: ({ req }) => ({ req, pubsub }),
})

mongoose
  .connect(MONGODB, { useNewUrlParser: true })
  .then(() => {
    console.log('MongoDB Connected')
    return server.listen({ port: 4000 })
    // server.listen().then(({ url }) => {
    //   console.log(`🚀  Server ready at ${url}`);
    // });
  })
  .then((res) => {
    console.log(`🚀 Server running at ${res.url}`)
  })