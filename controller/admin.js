const Account = require('../models/user');
const staff = require('../models/staff');
const QAcoordinator = require('../models/QAcoordinator');
const QAmanager = require('../models/QAmanager');
const bcrypt = require('bcryptjs');
exports.getAdmin = async (req, res) => {
    res.render('admin/admin', { loginName: req.session.email })
}

//view all QAmanager
exports.viewQAmanager = async (req, res) => {
    let listQAmanager = await trainer.find();
    res.render('admin/viewQAmanager', { listQAmanager: listQAmanager, loginName: req.session.email })
}

//view all QAcoordinator
exports.viewQAcoordinator = async (req, res) => {
    let listQAcoordinator = await staff.find();
    res.render('admin/viewQAcoordinator', { listQAcoordinator: listQAcoordinator, loginName: req.session.email })
}