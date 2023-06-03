import React from 'react'
import App from './App'
import { ApolloProvider, ApolloClient, InMemoryCache } from '@apollo/client'
// import ApolloClient from 'apollo-client'
// import { InMemoryCache } from 'apollo-cache-inmemory'
// import { createHttpLink } from 'apollo-link-http'
// import { ApolloProvider } from '@apollo/react-hooks'

// const httpLink = createHttpLink({
//   uri: 'http://localhost:4000',
// })

// const client = new ApolloClient({
//   link: httpLink,
//   cache: new InMemoryCache(),
// })

//  InMemoryCache : add client without reload page
// const cache = new InMemoryCache({
//   typePolicies: {
//     Query: {
//       fields: {
//         clients: {
//           merge(existing, incoming) {
//             return incoming
//           },
//         },
//         projects: {
//           merge(existing, incoming) {
//             return incoming
//           },
//         },
//       },
//     },
//   },
// })

const client = new ApolloClient({
  uri: process.env.NODE_ENV === 'development' ? 'http://localhost:4000' : '/',
  cache: new InMemoryCache(),
})

function AppProvider() {
  return (
    <ApolloProvider client={client}>
      <App />
    </ApolloProvider>
  )
}

export default AppProvider
