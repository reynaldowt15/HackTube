const redis = require("../config/redis");
const PostModel = require("../models/PostModel");
const REDIS_POSTS_KEY = 'posts:all'

const typeDefs = `#graphql
  type Post {
    _id: ID!
    content: String!
    tags: [String!]
    imgUrl: String
    authorId: ID!
    comments: [Comment!]
    likes: [Like!]
    createdAt: String!
    updatedAt: String!
    Author: User
  }

  type Comment {
    content: String!
    username: String!
    createdAt: String!
    updatedAt: String!
  }

  type Like {
    username: String!
    createdAt: String!
    updatedAt: String!
  }

  type Query {
    posts: [Post]
    postById(postId:String): Post
  }

  type Mutation {
    addPost(content: String!, tags: [String!], imgUrl: String): Post!
    addComment(postId:String, content:String): Comment
    addLike(postId:String): Like
  }
`;

const resolvers = {
    Query: {
        posts: async (_, __, contextValue) => {
            await contextValue.auth()

            const postsCache = await redis.get(REDIS_POSTS_KEY)
            if (postsCache) {
                return JSON.parse(postsCache)
            }

            const posts = await PostModel.getAllPosts()
            await redis.set(REDIS_POSTS_KEY, JSON.stringify(posts))
            return posts
        },
        postById: async (_, { postId }, contextValue) => {
            await contextValue.auth()

            if (!postId) {
                throw new Error('Post Id required')
            }

            const post = await PostModel.getPostById(postId)
            return post
        }
    },
    Mutation: {
        addPost: async (_, { content, tags = [], imgUrl }, contextValue) => {
            const loginInfo = await contextValue.auth();

            if (!content) {
                throw new Error("Content is required");
            }

            const newPost = await PostModel.addPost(content, tags, imgUrl ?? null, loginInfo._id)
            await redis.del(REDIS_POSTS_KEY)
            return newPost;
        },
        addComment: async (_, { postId, content }, contextValue) => {
            const loginInfo = await contextValue.auth()

            if (!postId) {
                throw new Error('Post Id required')
            }
            if (!content) {
                throw new Error('Content required')
            }

            const newComment = await PostModel.commentPost(postId, content, loginInfo.username)
            await redis.del(REDIS_POSTS_KEY)
            return newComment
        },
        addLike: async (_, { postId }, contextValue) => {
            const loginInfo = await contextValue.auth()

            if (!postId) {
                throw new Error('Post Id required')
            }

            const newLike = await PostModel.likePost(postId, loginInfo.username)
            await redis.del(REDIS_POSTS_KEY)
            return newLike
        }
    }
}

module.exports = {
    typeDefs,
    resolvers
}