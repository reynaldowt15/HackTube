const database = require("../config/mongodb");
const { hashSync } = require('bcryptjs');

class UserModel {
    static collection() {
        return database.collection('Users');
    }

    static async getUserByEmail(email) {
        return await this.collection().findOne({ email })
    }

    static async getAllUsers(search = '') {
        return await this.collection()
            .find({
                $or: [
                    { name: { $regex: search, $options: 'i' } },
                    { username: { $regex: search, $options: 'i' } },
                ]
            })
            .toArray();
    }

    static async addUser(name, username, email, password) {
        const existingEmail = await this.collection().findOne({
            $or: [
                { email },
                { username }
            ]
        });
        if (existingEmail) {
            throw new Error("Email or username already exists");
        }

        const hashedPassword = hashSync(password, 10);
        return await database.collection('Users').insertOne({ name, username, email, password: hashedPassword });
    }

    static async getUserByQuery(query) {
        const agg = [
            {
                '$match': query
            }, {
                '$project': {
                    'password': 0
                }
            }, {
                '$lookup': {
                    'from': 'Follows',
                    'localField': '_id',
                    'foreignField': 'followingId',
                    'as': 'FollowerRelation'
                }
            }, {
                '$lookup': {
                    'from': 'Users',
                    'localField': 'FollowerRelation.followerId',
                    'foreignField': '_id',
                    'as': 'followers'
                }
            }, {
                '$lookup': {
                    'from': 'Follows',
                    'localField': '_id',
                    'foreignField': 'followerId',
                    'as': 'FollowingRelation'
                }
            }, {
                '$lookup': {
                    'from': 'Users',
                    'localField': 'FollowingRelation.followingId',
                    'foreignField': '_id',
                    'as': 'following'
                }
            }, {
                '$project': {
                    'FollowerRelation': 0,
                    'FollowingRelation': 0,
                    'followers.password': 0,
                    'following.password': 0
                }
            }
        ];
        return await this.collection().aggregate(agg).next()
    }
}

module.exports = UserModel