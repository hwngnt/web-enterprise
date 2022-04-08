const mongoose = require('../db/db');

const ideas = new mongoose.Schema({
    categoryID: {
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'category',
        require : true
    }, 
    name: { 
        type: String,
        required: true
    },
    url: {
        type: String,
        required: true
    },
    author:{
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'user',
        require : true
    },
    time:{
        type: Date,
        default: Date.now()
    },
    like: { 
        type: Number,
        required: true
    },
    dislike:{
        type: Number,
        required: true
    },
    comments:[{
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'comments'
    }],
});

module.exports = mongoose.model('ideas', ideas);
