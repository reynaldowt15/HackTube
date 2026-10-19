const usersData = [
    {
        _id: "66f1a2b3c4d5e6f789012341",
        name: "Reynaldo Tendean",
        username: "reynaldo",
        email: "reynaldo@example.com",
    },
    {
        _id: "66f1a2b3c4d5e6f789012342",
        name: "Sarah Johnson",
        username: "sarah",
        email: "sarah@example.com",
    },
    {
        _id: "66f1a2b3c4d5e6f789012343",
        name: "Michael Chen",
        username: "michael",
        email: "michael@example.com",
    },
];

const typeDefs = `#graphql
  type User {
    _id: ID!
    name: String!
    username: String!
    email: String!
    password: String!
  }

  type Query {
    users: [User]
    userByUsername(username: String): [User]
  }
`;

const resolvers = {
    Query: {
        users: () => usersData,
        userByUsername: (_, args) => {
            const filteredUsers = usersData.filter((user) => {
                return user.username === args.username
            })
            return filteredUsers
        },
    }
}

module.exports = {
    typeDefs,
    resolvers
}