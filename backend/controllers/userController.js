const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { MongoClient } = require('mongodb');
const dotenv = require('dotenv');
dotenv.config();

const uri = process.env.MONGO_URI;
const ObjectId = require('mongodb').ObjectId;

let client;

async function connectClient() {
    if (!client) {
        client = new MongoClient(uri);
        await client.connect();
    }
}

const getAllUsers = async (req, res) => {
    try {
        await connectClient();
        const db = client.db('vcs_db');
        const usersCollection = db.collection('users');

        const users = await usersCollection
            .find({}, { projection: { password: 0 } })
            .toArray();

        res.status(200).json(users);
    } catch (err) {
        console.error(err);
        res.status(500).send('Internal server error');
    }
};

const signUpUser = async (req, res) => {
    const { username, password, email } = req.body;

    try {
        await connectClient();
        const db = client.db('vcs_db');
        const usersCollection = db.collection('users');

        const userExists = await usersCollection.findOne({ username });
        if (userExists) {
            return res.status(400).send('Username already exists');
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = {
            username,
            password: hashedPassword,
            email,
            repositories: [],
            followedUsers: [],
            starRepo: [],
            createdAt: new Date()
        };

        const result = await usersCollection.insertOne(newUser);
        const token = jwt.sign(
            { id: result.insertedId, username },
            process.env.JWT_SECRET
        );

        res.status(201).json({ message: 'User created successfully', token });
    } catch (err) {
        console.error(err);
        res.status(500).send('Internal server error');
    }
};

const loginUser = async (req, res) => {
    const { username, password } = req.body;

    try {
        await connectClient();
        const db = client.db('vcs_db');
        const usersCollection = db.collection('users');

        const user = await usersCollection.findOne({ username });
        if (!user) {
            return res.status(400).send('Invalid username or password');
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).send('Invalid username or password');
        }

        const token = jwt.sign(
            { id: user._id, username },
            process.env.JWT_SECRET
        );

        res.status(200).json({
            message: 'Login successful',
            token,
            userId: user._id
        });
    } catch (err) {
        console.error(err);
        res.status(500).send('Internal server error');
    }
};

const getUserProfile = async (req, res) => {
    const userId = req.params.id;

    try {
        await connectClient();
        const db = client.db('vcs_db');
        const usersCollection = db.collection('users');

        const user = await usersCollection.findOne(
            { _id: new ObjectId(userId) },
            { projection: { password: 0 } }
        );

        if (!user) {
            return res.status(404).send('User not found');
        }

        res.status(200).json(user);
    } catch (err) {
        console.error(err);
        res.status(500).send('Internal server error');
    }
};

const updateUserProfile = async (req, res) => {
    const userId = req.params.id;
    const { username, password } = req.body;

    try {
        await connectClient();
        const db = client.db('vcs_db');
        const usersCollection = db.collection('users');

        const updateData = {};

        if (username) {
            const exists = await usersCollection.findOne({ username });
            if (exists && exists._id.toString() !== userId) {
                return res.status(400).send('Username already exists');
            }
            updateData.username = username;
        }

        if (password) {
            const salt = await bcrypt.genSalt(10);
            updateData.password = await bcrypt.hash(password, salt);
        }

        await usersCollection.updateOne(
            { _id: new ObjectId(userId) },
            { $set: updateData }
        );

        res.status(200).send('User profile updated successfully');
    } catch (err) {
        console.error(err);
        res.status(500).send('Internal server error');
    }
};

const deleteUser = async (req, res) => {
    const userId = req.params.id;

    try {
        await connectClient();
        const db = client.db('vcs_db');
        const usersCollection = db.collection('users');

        await usersCollection.deleteOne({ _id: new ObjectId(userId) });
        res.status(200).send('User deleted successfully');
    } catch (err) {
        console.error(err);
        res.status(500).send('Internal server error');
    }
};

module.exports = {
    getAllUsers,
    signUpUser,
    loginUser,
    getUserProfile,
    updateUserProfile,
    deleteUser
};
