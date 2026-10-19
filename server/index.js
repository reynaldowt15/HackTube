const { ApolloServer } = require('@apollo/server');
const { startStandaloneServer } = require('@apollo/server/standalone');

const typeDefs = `#graphql
  type User {
    _id: ID!
    name: String!
    username: String!
    email: String!
    password: String!
  }

  type Post {
    _id: ID!
    content: String!
    tags: [String!]
    imgUrl: String!
    authorId: ID!
    comments: [Comment!]
    likes: [Like!]
    createdAt: String!
    updatedAt: String!
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

  type Follow {
    followingId: ID!
    followerId: ID!
    createdAt: String!
    updatedAt: String!
  }

  type Query {
    users: [User]
    posts: [Post]
    follows: [Follow]
  }
`;

const resolvers = {
    Query: {
    }
}

const server = new ApolloServer({
    typeDefs,
    resolvers,
});

async function startServer() {
    const { url } = await startStandaloneServer(server, {
        listen: { port: 3000 },
    });
    console.log(`🚀  Server ready at: ${url}`);
}

startServer()