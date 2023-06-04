const { ApolloServer } = require('apollo-server')
const { PubSub } = require('graphql-subscriptions')
const mongoose = require('mongoose')

const typeDefs = require('./graphql/typeDefs')
const resolvers = require('./graphql/resolvers')
// const { MONGODB } = require('./config.js')
require('dotenv').config()
const port = Number.parseInt(process.env.PORT) || 4000
const pubsub = new PubSub()

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: ({ req }) => ({ req, pubsub }),
})

mongoose
  .connect(process.env.MONGO_URI, { useNewUrlParser: true })
  .then(() => {
    console.log('MongoDB Connected')
    return server.listen({ port })
    // server.listen().then(({ url }) => {
    //   console.log(`🚀  Server ready at ${url}`);
    // });
  })
  .then((res) => {
    console.log(`🏆🏆🚀 Server running at ${res.url}`)
  })
  .catch((err) => {
    console.error(err)
  })
