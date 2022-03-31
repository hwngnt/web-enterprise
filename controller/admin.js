const Account = require('../models/user');
const Staff = require('../models/staff');
const QAcoordinator = require('../models/QAcoordinator');
const QAmanager = require('../models/QAmanager');
const category = require('../models/category');
const idea = require('../models/ideas');
const validation = require('./validation');
const bcrypt = require('bcryptjs');
const idea = require('../models/ideas');
exports.getAdmin = async (req, res) => {
    res.render('admin/admin', { loginName: req.session.email })
}

//QAmanager
exports.viewQAmanager = async (req, res) => {
    let listQAmanager = await QAmanager.find();
    res.render('admin/viewQAmanager', { listQAmanager: listQAmanager, loginName: req.session.email })
}
exports.addQAmanager = async (req, res) => {
    res.render('admin/addQAmanager', { loginName: req.session.email });
}
exports.doAddQAmanager = async (req, res) => {
    console.log(req.body)
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
    });
    try {
        bcrypt.genSalt(10, (err, salt) => {
            bcrypt.hash(newAccount.password, salt, (err, hash) => {
                if (err) throw err;
                newAccount.password = hash;
                newAccount = newAccount.save();
            });
        });
        newQAmanager = await newQAmanager.save();
        res.redirect('/admin/viewQualityAssuranceManager');
    }
    catch (error) {
        console.log(error);
        res.redirect('/admin/viewQualityAssuranceManager');
    }
}
exports.editQAmanager = async (req, res) => {
    let id = req.query.id;
    let aQAmanager = await QAmanager.findById(id);

    res.render('admin/editQAmanager', {aQAmanager:aQAmanager, loginName: req.session.email });
}
exports.doEditQAmanager = async (req, res) => {
    let id = req.body.id;
    let aQAmanager = await QAmanager.findById(id);
    // console.log(aQAmanager);
    
    try {
        if (req.file) {
            aQAmanager.img=req.file.filename;
        }
        aQAmanager.name = req.body.name;
        aQAmanager.dateOfBirth = new Date(req.body.date);
        aQAmanager.address = req.body.address;
        aQAmanager = await aQAmanager.save();
        res.redirect('/admin/viewQualityAssuranceManager');
    }
    catch (error) {
        console.log(error);
        res.redirect('/admin/viewQualityAssuranceManager');
    }
}
exports.deleteQAmanager = async (req, res) => {
    let id = req.query.id;
    let aQAmanager = await QAmanager.findById(id);
    let email = aQAmanager.email;
    console.log(email);
    Account.deleteOne({'email': email }, (err) => {
        if (err)
            throw err;
        else
            console.log('Account is deleted');
    })
    await QAmanager.findByIdAndRemove(id).then(data = {});

    res.redirect('/admin/viewQualityAssuranceManager');
}
exports.searchQAmanager = async (req, res) => {
    const searchText = req.body.keyword;
    //console.log(req.body.keyword);
    let listQAmanager;
    let checkAlphaName = validation.checkAlphabet(searchText);
    let checkEmpty = validation.checkEmpty(searchText);
    const searchCondition = new RegExp(searchText, 'i');

    //console.log(checkEmpty);
    if (!checkEmpty) {
        res.redirect('/admin/viewQualityAssuranceManager');
    }
    else if (checkAlphaName) {
        listQAmanager = await QAmanager.find({ name: searchCondition });
    }
    res.render('admin/viewQAmanager', { listQAmanager: listQAmanager, loginName: req.session.email });
}
//QAcoordinator
exports.viewQAcoordinator = async (req, res) => {
    let listQAcoordinator = await QAcoordinator.find();
    res.render('admin/viewQAcoordinator', { listQAcoordinator: listQAcoordinator, loginName: req.session.email })
}
exports.addQAcoordinator = async (req, res) => {
    res.render('admin/addQAcoordinator', { loginName: req.session.email });
}
exports.doAddQAcoordinator = async (req, res) => {
    let newQAcoordinator;
    console.log(req.body)
    if (req.file) {
        newQAcoordinator = new QAcoordinator({
            name: req.body.name,
            email: req.body.email,
            dateOfBirth: new Date(req.body.date),
            address: req.body.address,
            img: req.file.filename
        })
    }
    else {
        newQAcoordinator = new QAcoordinator({
            name: req.body.name,
            email: req.body.email,
            dateOfBirth: new Date(req.body.date),
            address: req.body.address
        })
    }
    let newAccount = new Account({
        email: req.body.email,
        password: "12345678",
        role: "QAcoordinator"
    })
    try {
        await bcrypt.genSalt(10, (err, salt) => {
            bcrypt.hash(newAccount.password, salt, (err, hash) => {
                if (err) throw err;
                newAccount.password = hash;
                newAccount = newAccount.save();
            });
        });
        newQAcoordinator = await newQAcoordinator.save();
        //console.log(newTrainee);
        res.redirect('/admin/viewQualityAssuranceCoordinator');
    }
    catch (error) {
        console.log(error);
        res.redirect('/admin/viewQualityAssuranceCoordinator');
    }
}
exports.editQAcoordinator = async (req, res) => {
    let id = req.query.id;
    let aQAcoordinator = await QAcoordinator.findById(id);

    res.render('admin/editQAcoordinator', {aQAcoordinator: aQAcoordinator, loginName: req.session.email });
}
exports.doEditQAcoordinator = async (req, res) => {
    let id = req.body.id;
    let aQAcoordinator = await QAcoordinator.findById(id);
    
    try {
        if (req.file) {
            aQAcoordinator.img=req.file.filename;
        }
        aQAcoordinator.name = req.body.name;
        aQAcoordinator.dateOfBirth = new Date(req.body.date);
        aQAcoordinator.address = req.body.address;
        aQAcoordinator = await aQAcoordinator.save();
        res.redirect('/admin/viewQualityAssuranceCoordinator');
    }
    catch (error) {
        console.log(error);
        res.redirect('/admin/viewQualityAssuranceCoordinator');
    }
}
exports.deleteQAcoordinator = async (req, res) => {
    let id = req.query.id;
    let aQAcoordinator = await QAcoordinator.findById(id);
    let email = aQAcoordinator.email;
    Account.deleteOne({'email': email }, (err) => {
        if (err)
            throw err;
        else
            console.log('Account is deleted');
    })
    await QAcoordinator.findByIdAndRemove(id).then(data = {});

    res.redirect('/admin/viewQualityAssuranceCoordinator');
}
exports.searchQAcoordinator = async (req, res) => {
    const searchText = req.body.keyword;
    //console.log(req.body.keyword);
    let listQAcoordinator;
    let checkAlphaName = validation.checkAlphabet(searchText);
    let checkEmpty = validation.checkEmpty(searchText);
    const searchCondition = new RegExp(searchText, 'i');

    //console.log(checkEmpty);
    if (!checkEmpty) {
        res.redirect('/admin/viewQualityAssuranceCoordinator');
    }
    else if (checkAlphaName) {
        listQAcoordinator = await QAcoordinator.find({name: searchCondition });
    }
    res.render('admin/viewQAcoordinator', { listQAcoordinator: listQAcoordinator, loginName: req.session.email });
}

//Staff
exports.viewStaff = async (req, res) => {
    let listStaff = await Staff.find();
    res.render('admin/viewStaff', { listStaff: listStaff, loginName: req.session.email })
}
exports.addStaff = async (req, res) => {
    res.render('admin/addStaff', { loginName: req.session.email });
}
exports.doAddStaff = async (req, res) => {
    let newStaff;
    if (req.file) {
        newStaff = new Staff({
            name: req.body.name,
            email: req.body.email,
            dateOfBirth: new Date(req.body.date),
            address: req.body.address,
            img: req.file.filename
        })
    }
    else {
        newStaff = new Staff({
            name: req.body.name,
            email: req.body.email,
            dateOfBirth: new Date(req.body.date),
            address: req.body.address
        })
    }
    let newAccount = new Account({
        email: req.body.email,
        password: "12345678",
        role: "Staff"
    })
    try {
        await bcrypt.genSalt(10, (err, salt) => {
            bcrypt.hash(newAccount.password, salt, (err, hash) => {
                if (err) throw err;
                newAccount.password = hash;
                newAccount = newAccount.save();
            });
        });
        newStaff = await newStaff.save();
        //console.log(newTrainee);
        res.redirect('/admin/viewStaff');
    }
    catch (error) {
        console.log(error);
        res.redirect('/admin/viewStaff');
    }
}
exports.editStaff = async (req, res) => {
    let id = req.query.id;
    let aStaff = await Staff.findById(id);

    res.render('admin/editStaff', {aStaff: aStaff, loginName: req.session.email });
}
exports.doEditStaff = async (req, res) => {
    let id = req.body.id;
    let aStaff = await Staff.findById(id);
    
    try {
        if (req.file) {
            aStaff.img=req.file.filename;
        }
        aStaff.name = req.body.name;
        aStaff.dateOfBirth = new Date(req.body.date);
        aStaff.address = req.body.address;
        aStaff = await aStaff.save();
        res.redirect('/admin/viewStaff');
    }
    catch (error) {
        console.log(error);
        res.redirect('/admin/viewStaff');
    }
}
exports.deleteStaff = async (req, res) => {
    let id = req.query.id;
    let aStaff = await Staff.findById(id);
    let email = aStaff.email;
    console.log(email);
    Account.deleteOne({'email': email }, (err) => {
        if (err)
            throw err;
        else
            console.log('Account is deleted');
    })
    await Staff.findByIdAndRemove(id).then(data = {});

    res.redirect('/admin/viewStaff');
}
exports.searchStaff = async (req, res) => {
    const searchText = req.body.keyword;
    console.log(req.body);
    let listStaff;
    let checkAlphaName = validation.checkAlphabet(searchText);
    let checkEmpty = validation.checkEmpty(searchText);
    const searchCondition = new RegExp(searchText, 'i');

    //console.log(checkEmpty);
    if (!checkEmpty) {
        res.redirect('/admin/viewStaff');
    }
    else if (checkAlphaName) {
        listStaff = await Staff.find({ name: searchCondition });
    }
    res.render('admin/viewStaff', { listStaff: listStaff, loginName: req.session.email });
}
//Edit date
exports.viewCategory = async (req, res) => {
    let listCategory = await category.find();
    res.render('admin/viewCategory', { listCategory: listCategory, loginName: req.session.email })
}
exports.editDate = async (req, res) => {
    let id = req.query.id;
    let aCategory = await category.findById(id);
    res.render('admin/editDate', { aCategory:aCategory, loginName: req.session.email })
}
exports.doEditDate = async (req, res) => {
    console.log(req.body)
    let id = req.body.id;
    
    let aCategory = await category.findById(id);
    console.log(req.body.dateStart)
    console.log(req.body.dateEnd)
    aCategory.dateStart = new Date(req.body.dateStart);
    aCategory.dateEnd = new Date(req.body.dateEnd);
    try {
        aCategory = await aCategory.save();
        res.redirect('/admin/viewCategory');
    }
    catch (error) {
        console.log(error);
        res.redirect('/admin/viewCategory');
    }
}

//view
exports.viewLastestIdeas = async (req, res) => {
    let listIdeas = await idea.find();
    let len_ideas = listIdeas.length;
    let last_ideas = [];
    if (len_ideas == 0) {
        last_ideas = [];
    }
    else if (len_ideas < 5) {
        last_ideas = listIdeas.reverse();
    }
    else {
        last_ideas = listIdeas.slice(-5, len_ideas).reverse();
    }
    let lastestIdeas = [];
    const fs = require('fs');
    await last_ideas.forEach(async (i) => {
        fs.readdir(i.url, (err, files) => {
            lastestIdeas.push({
                id: i._id,
                value: files,
                linkValue: i.url.slice(7),
                name: i.name,
                comment: i.comment,
                idCategory: i.categoryID,
                n_likes: i.like,
                n_dislikes: i.dislike,
                time: i.time
            });
        });
    });
    res.render('admin/viewLastestIdeas',{listIdeas: lastestIdeas});
}
exports.viewSubmittedIdeas = async (req, res) => {
    let listCategory = await category.find();
    res.render('admin/viewSubmittedIdeas', { listCategory: listCategory, loginName: req.session.email })
}
exports.viewCategoryDetail = async (req, res) => {
    // let id;
    // let listComment;
    // let nameIdea;
    // if (req.query.id === undefined) {
    //     id = req.body.idCategory;
    //     listComment = await comment.find({ ideaID: req.body.idIdea })
    //     nameIdea = await idea.findById(req.body.idIdea)
    //     nameIdea = nameIdea.name
    //     //console.log(nameIdea);
    // } else {
    //     id = req.query.id;
    // }
    let id = req.query.id;
    let listFiles = [];
    try {
        let listIdeas = await idea.find({ categoryID: id }).populate('comments').sort({ "time": -1 })
        let aCategory = await category.findById(id);
        let tempDate = new Date();
        let compare = tempDate > aCategory.dateEnd;
        const fs = require("fs");
        
        listIdeas.forEach(async (i) => {
            fs.readdir(i.url, (err, files) => {
                listFiles.push({
                    value: files,
                    linkValue: i.url.slice(7),
                    idea: i
                });
            });
        })
        //res.render('admin/viewCategoryDetail', { idCategory: id, listFiles: listFiles, nameIdea: nameIdea, listComment: listComment, compare: compare, loginName: req.session.email });
        res.render('admin/viewCategoryDetail', { idCategory: id, listFiles: listFiles, compare: compare, loginName: req.session.email });
    } catch (e) {
        console.log(e);
        res.render('admin/viewCategoryDetail', { idCategory: id, listFiles: listFiles, compare: compare, loginName: req.session.email });
    }
}

