const Account = require('../models/user');
const bcrypt = require('bcryptjs');
exports.getAdmin = async (req, res) => {
    res.render('admin/admin', { loginName: req.session.email })
}