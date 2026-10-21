const FollowModel = require("../models/FollowModel");

const typeDefs = `#graphql
  type Follow {
    _id: ID!
    followingId: ID!
    followerId: ID!
    createdAt: String!
    updatedAt: String!
  }

  type Mutation {
    followAccount(idFollowing:String): String
  }
`;

const resolvers = {
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