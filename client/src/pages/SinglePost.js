import React, { useContext } from 'react'
import { gql, useQuery } from '@apollo/client'
import { useNavigate, useParams } from 'react-router-dom'

import moment from 'moment'
import { Button, Card, Grid, Image, Icon, Label } from 'semantic-ui-react'

import { AuthContext } from '../context/auth'
import LikeButton from '../components/LikeButton'
import DeleteButton from '../components/DeleteButton'

function SinglePost(props) {
  // Get the userId param from the URL.
  const { postId } = useParams()
  const { user } = useContext(AuthContext)
  const navigate = useNavigate()
  console.log(postId)

  const { data } = useQuery(FETCH_POST_QUERY, {
    variables: {
      postId,
    },
  })

  function deletePostCallback() {
    navigate('/')
  }

  let postMarkup
  if (!data?.getPost) {
    postMarkup = <p>Loading post..</p>
  } else {
    const getPost = data.getPost
    const {
      id,
      body,
      createdAt,
      username,
      comments,
      likes,
      likeCount,
      commentCount,
    } = getPost
    console.log(
      '🚀 ~ file: SinglePost.js:41 ~ SinglePost ~ comments:',
      comments
    )

    postMarkup = (
      <Grid>
        <Grid.Row>
          <Grid.Column width={2}>
            <Image
              src="https://react.semantic-ui.com/images/avatar/large/molly.png"
              size="small"
              float="right"
            />
          </Grid.Column>
          <Grid.Column width={10}>
            <Card fluid>
              <Card.Content>
                <Card.Header>{username}</Card.Header>
                <Card.Meta>{moment(createdAt).fromNow()}</Card.Meta>
                <Card.Description>{body}</Card.Description>
              </Card.Content>
              <hr />
              <Card.Content extra>
                <LikeButton user={user} post={{ id, likeCount, likes }} />
                <Button
                  as="div"
                  labelPosition="right"
                  onClick={() => console.log('Comment on post')}
                >
                  <Button basic color="blue">
                    <Icon name="comments" />
                  </Button>
                  <Label basic color="blue" pointing="left">
                    {commentCount}
                  </Label>
                </Button>
                {user && user.username === username && (
                  <DeleteButton postId={id} callback={deletePostCallback} />
                )}
              </Card.Content>
            </Card>
          </Grid.Column>
        </Grid.Row>
      </Grid>
    )
  }
  return postMarkup
}

const FETCH_POST_QUERY = gql`
  query ($postId: ID!) {
    getPost(postId: $postId) {
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

export default SinglePost
