require('dotenv').config();

const { ApolloServer } = require('@apollo/server');
const { startStandaloneServer } = require('@apollo/server/standalone');
const { typeDefs: userTypeDefs, resolvers: userResolvers } = require('./schemas/user')
const { typeDefs: postTypeDefs, resolvers: postResolvers } = require('./schemas/post')
const { typeDefs: followTypeDefs, resolvers: followResolvers } = require('./schemas/follow')

const { verify } = require('jsonwebtoken');
const UserModel = require('./models/UserModel');
const { ObjectId } = require('mongodb');

const server = new ApolloServer({
    typeDefs: [userTypeDefs, postTypeDefs, followTypeDefs],
    resolvers: [userResolvers, postResolvers, followResolvers],
});

async function startServer() {
    const { url } = await startStandaloneServer(server, {
        listen: { port: 3000 },
        context: ({ req, res }) => {
            return {
                auth: async () => {
                    const { authorization } = req.headers
                    if (!authorization) {
                        throw new Error('Login first')
                    }

                    const [authType, token] = authorization.split(' ')
                    if (!authType || authType !== 'Bearer' || !token) {
                        throw new Error('Invalid Authorization')
                    }

                    try {
                        const payload = verify(token, process.env.JWT_SECRET)
                        const user = await UserModel.getUserByQuery({ _id: new ObjectId(payload._id) })
                        if (!user) {
                            throw new Error("User not found");
                        }
                        return payload
                    } catch (err) {
                        throw err
                    }
                }
            }
        }
    });
    console.log(`🚀  Server ready at: ${url}`);
}

startServer()