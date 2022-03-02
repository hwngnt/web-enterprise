const QAcoordinator = require('../models/QAcoordinator');
const Account = require('../models/user');
const Staff = require('../models/staff');
const QAmanager = require('../models/QAmanager');
const validation = require('./validation');
const bcrypt = require('bcryptjs');

exports.getQAC = async (req, res) => {
    res.render('qac/index')
}

//QAmanager
exports.mostPopularIdeas = async (req, res) => {
    res.render('qac/most_popular_ideas')
}

//QAmanager
exports.mostViewIdeas = async (req, res) => {
    res.render('qac/most_view_ideas')
}