const mongoose = require('mongoose');
const { Schema } = mongoose;

const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    passwordHash: {
        type: String,
        required: true
    },
    repository: [{
        default: [],
        type: Schema.Types.ObjectId,
        ref: 'Repository'
    }],
    followedUsers: [{
        default: [],
        type: Schema.Types.ObjectId,
        ref: 'User'
    }],
    starRepo: [{
        default: [],
        type: Schema.Types.ObjectId,
        ref: 'Repository'
    }],
    createdAt: {
        type: Date,
        default: Date.now
    }
});
const User = mongoose.model('User', UserSchema);
module.exports = User;