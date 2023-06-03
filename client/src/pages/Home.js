import React from 'react'
import gql from 'graphql-tag'
import { useQuery } from '@apollo/client'
import { Grid } from 'semantic-ui-react'

import PostCard from '../components/PostCard'

function Home() {
  const { loading, error, data } = useQuery(FETCH_POSTS_QUERY)

  const posts = data?.getPosts || []
  return (
    <Grid columns={3}>
      {error && <p>Something Went Wrong</p>}
      <Grid.Row className="page-title">
        <h1>Recent Posts</h1>
      </Grid.Row>
      <Grid.Row>
        {loading ? (
          <h1>Loading posts..</h1>
        ) : (
          posts.map((post) => (
            <Grid.Column key={post.id} style={{ marginBottom: 20 }}>
              <PostCard post={post} />
            </Grid.Column>
          ))
        )}
      </Grid.Row>
    </Grid>
  )
}

const FETCH_POSTS_QUERY = gql`
  {
    getPosts {
      id
      body
      createdAt
      username
      likeCount
      likes {
        username
      }
      commentCount
      comments {
        id
        username
        createdAt
        body
      }
    }
  }
`

export default Home
