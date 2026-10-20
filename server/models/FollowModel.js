const { ObjectId } = require("mongodb")
const database = require("../config/mongodb")
const UserModel = require("./UserModel")

class FollowModel {
    static collection() {
        return database.collection('Follows')
    }

    static async addFollow(_idFollowing, _idFollower) {
        const validUser = await UserModel.getUserByQuery({ _id: new ObjectId(_idFollowing) })
        if (!validUser) {
            throw new Error('User not valid')
        }

        await this.collection().insertOne({
            followingId: validUser._id,
            followerId: new ObjectId(_idFollower),
            createdAt: new Date(),
            updatedAt: new Date()
        })
    }
}

module.exports = FollowModel