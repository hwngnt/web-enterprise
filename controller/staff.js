const Category = require('../ models/category');
const validation = require('./validation');
const bcrypt = require('bcryptjs');

exports.getStaff = async (req, res) => {
    res.render('staff/staff', { loginName: req.session.email })
}

