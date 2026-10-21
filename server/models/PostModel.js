const { ObjectId } = require("mongodb");
const database = require("../config/mongodb");

class PostModel {
    static collection() {
        return database.collection("Posts");
    }

    static async getAllPosts() {
        const agg = [
            {
                '$lookup': {
                    'from': 'Users',
                    'localField': 'authorId',
                    'foreignField': '_id',
                    'as': 'Author'
                }
            }, {
                '$unwind': {
                    'path': '$Author',
                    'preserveNullAndEmptyArrays': true
                }
            }, {
                '$project': {
                    'Author.password': 0
                }
            }, {
                '$sort': {
                    '_id': -1
                }
            }
        ];

        return await this.collection().aggregate(agg).toArray();
    }

    static async getPostById(postId) {
        const agg = [
            {
                '$match': { _id: new ObjectId(postId) }
            }, {
                '$lookup': {
                    'from': 'Users',
                    'localField': 'authorId',
                    'foreignField': '_id',
                    'as': 'Author'
                }
            }, {
                '$unwind': {
                    'path': '$Author',
                    'preserveNullAndEmptyArrays': true
                }
            }, {
                '$project': {
                    'Author.password': 0
                }
            }
        ];

        return await this.collection().aggregate(agg).next()
    }

    static async addPost(content, tags, imgUrl, authorId) {
        const createdAt = new Date();
        const post = {
            content,
            tags,
            imgUrl,
            authorId: new ObjectId(authorId),
            comments: [],
            likes: [],
            createdAt,
            updatedAt: createdAt,
        };

        const { insertedId } = await this.collection().insertOne(post);

        return {
            ...post,
            _id: insertedId,
            createdAt: createdAt.toISOString(),
            updatedAt: createdAt.toISOString(),
        };
    }

    static async commentPost(postId, content, username) {
        const createdAt = new Date()
        const comment = {
            content,
            username,
            createdAt,
            updatedAt: createdAt
        }
        await this.collection().updateOne(
            { _id: new ObjectId(postId) },
            {
                $push: {
                    comments: comment
                }
            }
        )
        return comment
    }

    static async likePost(postId, username) {
        const createdAt = new Date()
        const like = {
            username,
            createdAt,
            updatedAt: createdAt
        }
        await this.collection().updateOne(
            { _id: new ObjectId(postId) },
            {
                $push: {
                    likes: like
                }
            }
        )
        return like
    }
}

module.exports = PostModel;