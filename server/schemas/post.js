const PostModel = require("../models/PostModel");

const postsData = [
    {
        _id: "66f1b2c3d4e5f60789012301",
        content: "Enjoying a beautiful sunset at the beach!",
        tags: ["beach", "sunset", "travel"],
        imgUrl: "https://picsum.photos/id/1018/800/600",
        authorId: "66f1a2b3c4d5e6f789012341",

        comments: [
            {
                content: "Beautiful view!",
                username: "sarah",
                createdAt: "2026-10-18T10:30:00.000Z",
                updatedAt: "2026-10-18T10:30:00.000Z",
            },
            {
                content: "Where is this place?",
                username: "michael",
                createdAt: "2026-10-18T11:00:00.000Z",
                updatedAt: "2026-10-18T11:00:00.000Z",
            },
        ],

        likes: [
            {
                username: "sarah",
                createdAt: "2026-10-18T10:15:00.000Z",
                updatedAt: "2026-10-18T10:15:00.000Z",
            },
            {
                username: "michael",
                createdAt: "2026-10-18T10:20:00.000Z",
                updatedAt: "2026-10-18T10:20:00.000Z",
            },
        ],

        createdAt: "2026-10-18T10:00:00.000Z",
        updatedAt: "2026-10-18T11:00:00.000Z",
    },

    {
        _id: "66f1b2c3d4e5f60789012302",
        content: "Working on a new React project today!",
        tags: ["coding", "javascript", "react"],
        imgUrl: "https://picsum.photos/id/0/800/600",
        authorId: "66f1a2b3c4d5e6f789012342",

        comments: [
            {
                content: "Good luck with your project!",
                username: "reynaldo",
                createdAt: "2026-10-19T08:30:00.000Z",
                updatedAt: "2026-10-19T08:30:00.000Z",
            },
        ],

        likes: [
            {
                username: "reynaldo",
                createdAt: "2026-10-19T08:15:00.000Z",
                updatedAt: "2026-10-19T08:15:00.000Z",
            },
        ],

        createdAt: "2026-10-19T08:00:00.000Z",
        updatedAt: "2026-10-19T08:30:00.000Z",
    },

    {
        _id: "66f1b2c3d4e5f60789012303",
        content: "A little adventure in the mountains.",
        tags: ["nature", "mountains", "adventure"],
        imgUrl: "https://picsum.photos/id/1015/800/600",
        authorId: "66f1a2b3c4d5e6f789012343",

        comments: [],
        likes: [],

        createdAt: "2026-10-19T09:30:00.000Z",
        updatedAt: "2026-10-19T09:30:00.000Z",
    },
];

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
    postByTag(tag: String): [Post]
  }

  type Mutation {
    addPost(content: String!, tags: [String!], imgUrl: String): Post!
  }
`;

const resolvers = {
    Query: {
        posts: async () => {
            const posts = await PostModel.getAllPosts()
            return posts
        },
        postByTag: (_, args) => {
            const filteredTags = postsData.filter((post) => {
                return post.tags.includes(args.tag)
            })
            return filteredTags
        }
    },
    Mutation: {
        addPost: async (_, { content, tags = [], imgUrl }, contextValue) => {
            const loginInfo = await contextValue.auth();

            if (!content) {
                throw new Error("Content is required");
            }

            return await PostModel.addPost(content, tags, imgUrl ?? null, loginInfo._id);
        }
    }
}

module.exports = {
    typeDefs,
    resolvers
}