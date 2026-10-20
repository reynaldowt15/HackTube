const { ObjectId } = require("mongodb");
const database = require("../config/mongodb");

class PostModel {
    static collection() {
        return database.collection("Posts");
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
}

module.exports = PostModel;
