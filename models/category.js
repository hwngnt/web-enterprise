const mongoose = require('../db/db');

const category = new mongoose.Schema({
    name: { 
        type: String,
        required: true
    },
    description: { 
        type: String,
        required: true
    },
    dateStart:{
        type: Date,
        required: true
    },
    dateEnd:{
        type: Date,
        required: true
    },
    url: {
        type: String,
        required: true
    },
    ideaID: {
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'ideas',
        require : true
    }
});

module.exports = mongoose.model('category', category);