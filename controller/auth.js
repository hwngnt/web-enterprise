const Account = require('../models/user');
const bcrypt = require('bcryptjs');

exports.handleLogin = async (req, res) => {
    const username = req.body.username;
    const password = req.body.password;
    console.log(username)
    try {
        let user = await Account.findOne({ email: username });
        console.log(user)
        await bcrypt.compare(password, user.password).then((doMatch) => {
            if (doMatch) {
                if (user.role == 'admin') {
                    req.session.user = user;
                    req.session.email = username;
                    req.session.admin = true;
                    req.session.sort = 'id';
                    res.redirect('/admin');
                }else if(user.role == 'Staff'){
                    req.session.user = user;
                    req.session.email = username;
                    req.session.staff = true;
                    res.redirect('/staff');
                }else if(user.role == 'QAmanager'){
                    req.session.user = user;
                    req.session.email = username;
                    req.session.QAmanager = true;
                    res.redirect('/qam_index');
                }else{
                    req.session.user = user;
                    req.session.email = username;
                    req.session.QAcoordinator = true;
                    res.redirect('/qac');
                }
            } else {
                return res.render('index', { errors: 'Username or password is incorrect' })
            }
        })
    } catch (error) {
        console.log(error);
        return res.render('index');
    }
};

exports.handleLogout = async (req, res) => {
    req.session.destroy();
    res.redirect('/');
}