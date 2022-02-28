const mongoose = require('../db/db');

const staffSchema = new mongoose.Schema({
    name: { 
        type: String,
        required: true
    },
    email:{
        type: String,
        required: true,
        unique: true
    },
    age:{
        type: Number,
        required: true
    },
    address:{
        type: String,
        required: true
    },
    img: {
        type: String,
        default: "user.png"
    }
});

module.exports = mongoose.model('Staff', staffSchema);