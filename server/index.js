const express = require('express')
const { PubSub } = require('graphql-subscriptions')
const path = require('path')
const mongoose = require('mongoose')
const { ApolloServer } = require('apollo-server-express')
require('dotenv').config()
const typeDefs = require('./graphql/typeDefs')
const resolvers = require('./graphql/resolvers')

async function startApolloServer() {
  const app = express()
  const pubsub = new PubSub()
  const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: ({ req }) => ({ req, pubsub }),
    // context: async ({ req }) => ({ token: req.headers.token }),
  })

  await server.start()

  mongoose
    .connect(process.env.MONGO_URI, { useNewUrlParser: true })
    .then(() => {
      console.log('🏆🏆🚀 MongoDB Connected🏆🏆🚀 ')
    })
    .catch((err) => {
      console.error(err)
    })

  server.applyMiddleware({ app })

  app.use(express.static(path.join(__dirname, '../client', 'build')))
  app.get('*', (req, res) =>
    res.sendFile(path.join(__dirname, '../client', 'build', 'index.html'))
  )

  await new Promise((resolve) => app.listen({ port: 4000 }, resolve))
  console.log(`🚀 Server ready at http://localhost:4000${server.graphqlPath}`)
  return { server, app }
}

startApolloServer()
