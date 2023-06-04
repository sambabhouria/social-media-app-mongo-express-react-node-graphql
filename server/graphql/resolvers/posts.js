const { AuthenticationError, UserInputError } = require('apollo-server')

const Post = require('../../models/Post')
const checkAuth = require('../../util/check-auth')

module.exports = {
  Query: {
    async getPosts() {
      try {
        const posts = await Post.find().sort({ createdAt: -1 })
        return posts
      } catch (err) {
        throw new Error(err)
      }
    },
    async getPost(_, { postId }) {
      try {
        const post = await Post.findById(postId)
        if (post) {
          return post
        } else {
          throw new Error('Post not found')
        }
      } catch (err) {
        throw new Error(err)
      }
    },
  },
  Mutation: {
    async createPost(_, { body }, context) {
      const user = checkAuth(context)
      if (body.trim() === '') {
        throw new Error('Post body must not be empty')
      }

      const newPost = new Post({
        body,
        user: user.id,
        username: user.username,
        createdAt: new Date().toISOString(),
      })

      const post = await newPost.save()

      context.pubsub.publish('NEW_POST', {
        newPost: post,
      })

      return post
    },
    async deletePost(_, { postId }, context) {
      const user = checkAuth(context)
      try {
        const post = await Post.findById(postId)
        if (user.username === post.username) {
          if (post) {
            await await Post.deleteOne({ _id: postId })
            return 'Post deleted successfully'
          }
        } else {
          throw new AuthenticationError('Action not allowed')
        }
      } catch (err) {
        throw new Error(err)
      }
    },
    async likePost(_, { postId }, context) {
      const { username } = checkAuth(context)

      const post = await Post.findById(postId)
      if (post) {
        if (post.likes.find((like) => like.username === username)) {
          // Post already likes, unlike it
          post.likes = post.likes.filter((like) => like.username !== username)
        } else {
          // Not liked, like post
          post.likes.push({
            username,
            createdAt: new Date().toISOString(),
          })
        }

        await post.save()
        return post
      } else throw new UserInputError('Post not found')
    },
  },
  Subscription: {
    newPost: {
      subscribe: (_, __, { pubsub }) => pubsub.asyncIterator('NEW_POST'),
    },
  },
  /**
   * https://www.apollographql.com/docs/apollo-server/v3/data/subscriptions
   * npm install graphql-subscriptions
   * import { PubSub } from 'graphql-subscriptions';
      const pubsub = new PubSub();
    Publishing an event
    You can publish an event using the publish method of a PubSub instance:

    pubsub.publish('POST_CREATED', {
    postCreated: {
      author: 'Ali Baba',
      comment: 'Open sesame'
    }
    });

    The first parameter is the name of the event label you're publishing to, as a string.
    You don't need to register a label name before publishing to it.
    The second parameter is the payload associated with the event.
    The payload should include whatever data is necessary for your resolvers to populate the associated Subscription field and its subfields.
    When working with GraphQL subscriptions, you publish an event whenever a subscription's return value should be updated. One common cause of such an update is a mutation, but any back-end logic might result in changes that should be published.

    As an example, let's say our GraphQL API supports a createPost mutation:

    type Mutation {
      createPost(author: String, comment: String): Post
    }

    A basic resolver for createPost might look like this:

    const resolvers = {
    Mutation: {
      createPost(parent, args, context) {
        // Datastore logic lives in postController
        return postController.createPost(args);
      },
    },
    // ...other resolvers...

    Before we persist the new post's details in our datastore, 
    we can publish an event that also includes those details:

    const resolvers = {
      Mutation: {
        createPost(parent, args, context) {
          pubsub.publish('POST_CREATED', { postCreated: args }); 
          return postController.createPost(args);
        },
      },
      // ...other resolvers...
    };

    Next, we can listen for this event in our Subscription field's resolver.
    pubsub.asyncIterator(['POST_CREATED']);

    const resolvers = {
    Subscription: {
      postCreated: {
        subscribe: () => pubsub.asyncIterator(['POST_CREATED']),
      },
    },
    
    // ...other resolvers...
};

    };

   */
}
