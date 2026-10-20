const database = require("../config/mongodb");
const { hashSync } = require('bcryptjs');

class UserModel {
    static collection() {
        return database.collection('Users');
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
        return await this.collection().findOne(query)
    }
}

module.exports = UserModel