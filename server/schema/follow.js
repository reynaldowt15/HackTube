const followsData = [
    {
        followingId: "66f1a2b3c4d5e6f789012342",
        followerId: "66f1a2b3c4d5e6f789012341",
        createdAt: "2026-10-10T09:00:00.000Z",
        updatedAt: "2026-10-10T09:00:00.000Z",
    },
    {
        followingId: "66f1a2b3c4d5e6f789012343",
        followerId: "66f1a2b3c4d5e6f789012341",
        createdAt: "2026-10-11T09:00:00.000Z",
        updatedAt: "2026-10-11T09:00:00.000Z",
    },
    {
        followingId: "66f1a2b3c4d5e6f789012341",
        followerId: "66f1a2b3c4d5e6f789012342",
        createdAt: "2026-10-12T09:00:00.000Z",
        updatedAt: "2026-10-12T09:00:00.000Z",
    },
];

const typeDefs = `#graphql
  type Follow {
    followingId: ID!
    followerId: ID!
    createdAt: String!
    updatedAt: String!
  }

  type Query {
    follows: [Follow]
  }
`;

const resolvers = {
    Query: {
        follows: () => followsData,
    }
}

module.exports = {
    typeDefs,
    resolvers
}