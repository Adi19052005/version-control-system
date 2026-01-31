const mongoose = require('mongoose');
const { Schema } = mongoose;
const RepoSchema = new mongoose.Schema({
    name: {
        type: String,   
        required: true,
        unique: true
    },
    description: {
        type: String,
    },
    content: [{
        type:String       
    }],
    visibility: {   
        type:Boolean,
        default:true
    },
    owner: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    issue:{
        type: Schema.Types.ObjectId,
        ref: 'Issue'
    }
    });
const Repository = mongoose.model('Repository', RepoSchema);
module.exports = Repository;