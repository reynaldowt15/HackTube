const UserModel = require("../models/UserModel");
const { compareSync } = require("bcryptjs")
const { sign } = require("jsonwebtoken");
const { ObjectId } = require("mongodb");

const typeDefs = `#graphql
  type User {
    _id: ID!
    name: String!
    username: String!
    email: String!
    followers: [User]
    following: [User]
  }

  type registerResponse {
    _id: ID!
    username: String!
    email: String!
  }
  
  type loginResponse {
    token: String!
  }

  type Query {
    users: [User]
    userByUsernameOrName(search: String): [User]
    userById: User
  }

  type Mutation {
    register(name: String, username: String, email: String, password: String): registerResponse
    login(email: String, password: String): loginResponse
  }
`;

const resolvers = {
    Query: {
        users: async (_, __, contextValue) => {
            await contextValue.auth()

            const users = UserModel.getAllUsers();
            return users;
        },
        userByUsernameOrName: async (_, { search }, contextValue) => {
            await contextValue.auth()

            const users = await UserModel.getAllUsers(search)
            return users
        },
        userById: async (_, __, contextValue) => {
            const loginInfo = await contextValue.auth()

            const user = await UserModel.getUserByQuery({ _id: new ObjectId(loginInfo._id) })
            return user
        }
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
        },

        login: async (_, { email, password }) => {
            if (!email || !password) {
                throw new Error("Email and Password are required")
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

            const user = await UserModel.getUserByQuery({ email })
            if (!user) {
                throw new Error("Invalid Email or Password")
            }

            const validPassword = compareSync(password, user.password)
            if (!validPassword) {
                throw new Error("Invalid Email or Password")
            }

            const token = sign({ _id: user._id, username: user.username }, process.env.JWT_SECRET, { expiresIn: '1d' })
            return { token }
        }
    }
}

module.exports = {
    typeDefs,
    resolvers
}