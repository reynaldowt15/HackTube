const UserModel = require("../models/UserModel");

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
  }

  type registerResponse {
    _id: ID!
    username: String!
    email: String!
  }

  type Query {
    users: [User]
    userByUsername(username: String): [User]
  }

  type Mutation {
    register(name: String, username: String, email: String, password: String): registerResponse
  }
`;

const resolvers = {
    Query: {
        users: () => {
            const users = UserModel.getAllUsers();
            return users;
        },
        userByUsername: (_, args) => {
            const filteredUsers = usersData.filter((user) => {
                return user.username === args.username
            })
            return filteredUsers
        },
    },

    Mutation: {
        register: async (_, { name, username, email, password }) => {
            if (!name || !username || !email || !password) {
                throw new Error("Name, Username, Email, and Password are required")
            }
            if (email) {
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailRegex.test(email)) {
                    throw new Error("Invalid email format");
                }
            }

            if (password.length < 5) {
                throw new Error("Password must be at least 5 characters long");
            }

            const newUser = await UserModel.addUser(name, username, email, password)
            return { _id: newUser.insertedId, username, email }
        }
    }
}

module.exports = {
    typeDefs,
    resolvers
}