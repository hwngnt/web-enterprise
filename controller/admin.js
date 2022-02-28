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
    let listQAmanager = await QAmanager.find();
    res.render('admin/viewQAmanager', { listQAmanager: listQAmanager, loginName: req.session.email })
}
exports.addQAmanager = async (req, res) => {
    res.render('admin/addQAmanager', { loginName: req.session.email });
}
exports.doAddQAmanager = async (req, res) => {
    let newQAmanager;
    if (req.file) {
        newQAmanager = new QAmanager({
            name: req.body.name,
            email: req.body.email,
            dateOfBirth: new Date(req.body.date),
            address: req.body.address,
            img: req.file.filename
        })
    }
    else {
        newQAmanager = new QAmanager({
            name: req.body.name,
            email: req.body.email,
            dateOfBirth: new Date(req.body.date),
            address: req.body.address
        })
    }
    let newAccount = new Account({
        email: req.body.email,
        password: "12345678",
        role: "QAmanager"
    })
    try {
        await bcrypt.genSalt(10, (err, salt) => {
            bcrypt.hash(newAccount.password, salt, (err, hash) => {
                if (err) throw err;
                newAccount.password = hash;
                newAccount = newAccount.save();
                newQAmanager = newQAmanager.save();
            });
        });
        // console.log(newTrainee);
        res.redirect('/admin/viewQualityAssuranceManager');
    }
    catch (error) {
        console.log(error);
        res.redirect('/admin/viewQualityAssuranceManager');
    }
}

//view all QAcoordinator
exports.viewQAcoordinator = async (req, res) => {
    let listQAcoordinator = await staff.find();
    res.render('admin/viewQAcoordinator', { listQAcoordinator: listQAcoordinator, loginName: req.session.email })
}