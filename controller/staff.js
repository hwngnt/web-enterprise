const validation = require('./validation');
const bcrypt = require('bcryptjs');
const idea = require('../models/ideas');
const category = require('../models/category');
const comment = require('../models/comments');
const multer = require('multer');
const { redirect } = require('express/lib/response');


exports.getStaff = async (req, res) => {
    res.render('staff/staff', { loginName: req.session.email })
}

exports.addIdea = async (req,  res) => {
    var id = req.query.id;
    res.render('staff/addIdeas', {idCategory:id,  loginName: req.session.email })
}
exports.doAddIdea = async (req, res) => {
    const fs = require("fs");
    
    var idCategory = req.body.idCategory;
    let aCategory = await category.findById(idCategory);
    console.log(aCategory);
    let path = aCategory.url + '/' + req.body.name;
    console.log(req.session.user._id);
    await fs.access(path, (error) => {
        if (error) {
            fs.mkdir(path, (error) => {
                if (error) {
                    console.log(error);
                } else {
                    console.log("New Directory created successfully !!");
                    let newIdea = new idea({
                        categoryID: aCategory._id,
                        name: req.body.name,
                        author: req.session.user._id,
                        url: path,
                        like: 0,
                        dislike: 0
                    })
                    newIdea = newIdea.save();
                }
            });
        } else {
            console.log("Given Directory already exists !!");
        }
    });
    res.render('staff/addFileToIdea', {idCategory:idCategory, path: path, loginName: req.session.email })
}
exports.doAddFile = async (req, res) => {
    let id = req.body.idCategory;
    res.redirect('viewCategoryDetail?id='+ id)
}

exports.viewLastestIdeas = async (req, res) => {
    let listIdeas = await idea.find();
    let len_ideas = listIdeas.length;
    let last_ideas = [];
    if(len_ideas == 0){
        last_ideas = [];
    }
    else if(len_ideas < 5){
        last_ideas = listIdeas.reverse();
    }
    else{
        last_ideas = listIdeas.slice(-5, len_ideas).reverse();
    }
    res.render('staff/viewLastestIdeas',{listIdeas: last_ideas});
}

exports.viewSubmittedIdeas = async (req, res) => {
    let listCategory = await category.find();
    res.render('staff/viewSubmittedIdeas', { listCategory: listCategory, loginName: req.session.email })
}

exports.viewCategoryDetail = async (req, res) => {
    let id = req.query.id;
    let listIdeas = await idea.find({categoryID: id})
    
    const fs = require("fs");
    let listFiles = [];
    let count=0;
    await listIdeas.forEach(i => {
        fs.readdir(i.url, (err, files) => {
            listFiles.push({
                key: count,
                value: files,
                linkValue: i.url.slice(7)
            });
            count+=1;
        })
    })
    res.render('staff/viewCategoryDetail', { idCategory: id,listFiles: listFiles, loginName: req.session.email })
}

exports.doComment = async (req, res) => {
    newComment = new comment({
        ideaID : req.body.ideaID,
        author: req.session.user._id,
        comment: req.body.comment,
    })
    newComment = await newComment.save();
    console.log(newComment.comment);
        res.redirect('/staff/viewCategoryDetail');
}