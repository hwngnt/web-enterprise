const Account = require('../models/user');
const bcrypt = require('bcryptjs');
exports.getQAM = async (req, res) => {
    res.render('qam/qam_index', { loginName: req.session.email })
}

exports.getQAMAddCategory = async (req, res) => {
    res.render('qam/qamAddCategory', { loginName: req.session.email })
}
