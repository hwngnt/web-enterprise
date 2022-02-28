const Account = require('../models/user');
const bcrypt = require('bcryptjs');

exports.handleLogin = async (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    try {
        let user = await Account.findOne({ email: username });
        await bcrypt.compare(password, user.password).then((doMatch) => {
            if (doMatch) {
                if (user.role == 'admin') {
                    req.session.user = user;
                    req.session.email = username;
                    req.session.admin = true;
                    res.redirect('/admin');
                }else if(user.role == 'staff'){
                    req.session.user = user;
                    req.session.email = username;
                    req.session.staff = true;
                    res.redirect('/QAmanager');
                }else if(user.role == 'QAmanager'){
                    req.session.user = user;
                    req.session.email = username;
                    req.session.QAmanager = true;
                    res.redirect('/QAmanager');
                }else{
                    req.session.user = user;
                    req.session.email = username;
                    req.session.QAcoordinator = true;
                    res.redirect('/QAcoordinator');
                }
            } else {
                return res.render('index', { errors: 'Username or password is incorrect' })
            }

        })
            // .catch(err => {
            //     console.log(err)
            // })
    } catch (error) {
        console.log(error);
        return res.render('index');
    }
};

exports.handleLogout = async (req, res) => {
    req.session.destroy();
    res.redirect('/');
}