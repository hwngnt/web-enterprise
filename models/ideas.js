const mongoose = require('../db/db');

const ideas = new mongoose.Schema({
    categoryID: {
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'category'
    }, 
    name: { 
        type: String,
        required: true
    },
    url: {
        type: String,
        required: true
    },
    like: { 
        type: Number,
        required: true
    },
    dislike:{
        type: Number,
        required: true
    },
});

module.exports = mongoose.model('ideas', ideas);
