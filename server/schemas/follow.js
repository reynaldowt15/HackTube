const FollowModel = require("../models/FollowModel");

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
    _id: ID!
    followingId: ID!
    followerId: ID!
    createdAt: String!
    updatedAt: String!
  }

  type Query {
    follows: [Follow]
  }

  type Mutation {
    followAccount(idFollowing:String): String
  }
`;

const resolvers = {
    Query: {
        follows: () => followsData,
    },
    Mutation: {
        followAccount: async (_, { idFollowing }, contextValue) => {
            const loginInfo = await contextValue.auth()

            if (!idFollowing) {
                throw new Error('User Id required')
            }

            await FollowModel.addFollow(idFollowing, loginInfo._id)
            return `Follow Success`
        }
    }
}

module.exports = {
    typeDefs,
    resolvers
}