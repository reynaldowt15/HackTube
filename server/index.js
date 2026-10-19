const { ApolloServer } = require('@apollo/server');
const { startStandaloneServer } = require('@apollo/server/standalone');
const { typeDefs: userTypeDefs, resolvers: userResolvers } = require('./schema/user')
const { typeDefs: postTypeDefs, resolvers: postResolvers } = require('./schema/post')
const { typeDefs: followTypeDefs, resolvers: followResolvers } = require('./schema/follow')

const server = new ApolloServer({
    typeDefs: [userTypeDefs, postTypeDefs, followTypeDefs],
    resolvers: [userResolvers, postResolvers, followResolvers],
});

async function startServer() {
    const { url } = await startStandaloneServer(server, {
        listen: { port: 3000 },
    });
    console.log(`🚀  Server ready at: ${url}`);
}

startServer()