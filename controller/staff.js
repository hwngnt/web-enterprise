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

exports.addIdea = async (req, res) => {
    var id = req.query.id;
    res.render('staff/addIdeas', { idCategory: id, loginName: req.session.email })
}
exports.doAddIdea = async (req, res) => {
    const fs = require("fs");

    var idCategory = req.body.idCategory;
    let aCategory = await category.findById(idCategory);
    // console.log(aCategory);
    let path = aCategory.url + '/' + req.body.name;
    // console.log(req.session.user._id);
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
                        dislike: 0,
                        comment: 0
                    })
                    newIdea = newIdea.save();
                }
            });
        } else {
            console.log("Given Directory already exists !!");
        }
    });
    res.render('staff/addFileToIdea', { idCategory: idCategory, path: path, loginName: req.session.email })
}
exports.doAddFile = async (req, res) => {
    let id = req.body.idCategory;
    res.redirect('viewCategoryDetail?id=' + id)
}

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
    res.render('staff/viewLastestIdeas', { listIdeas: last_ideas });
}

exports.viewSubmittedIdeas = async (req, res) => {
    let listCategory = await category.find();
    res.render('staff/viewSubmittedIdeas', { listCategory: listCategory, loginName: req.session.email })
}

exports.viewCategoryDetail = async (req, res) => {
    let id;
    let listComment;
    let nameIdea;
    if(req.query.id === undefined){
        id = req.body.idCategory;
        listComment = await comment.find({ideaID : req.body.idIdea })
        nameIdea = await idea.findById( req.body.idIdea)
        nameIdea = nameIdea.name
    //console.log(nameIdea);
    }else{
        id = req.query.id;
    }
    // console.log(id );
    let listIdeas = await idea.find({ categoryID: id }).sort({"name": -1})
    
    let aCategory = await category.findById(id);
    let tempDate = new Date();
    let compare = tempDate > aCategory.dateEnd;
    const fs = require("fs");
    let listFiles = [];
    await listIdeas.forEach(async (i) => {
        fs.readdir(i.url, (err, files) => {
            listFiles.push({
                id: i._id,
                value: files,
                linkValue: i.url.slice(7),
                name: i.name,
                comment: i.comment
            });
        });
        // console.log(listFiles);
    })
    res.render('staff/viewCategoryDetail', { idCategory: id, listFiles: listFiles, nameIdea: nameIdea, listComment:listComment, compare: compare,  loginName: req.session.email });
}




exports.doComment = async (req, res) => {
    let id = req.body.idCategory;
    //console.log(req.body.idCategory);
    newComment = new comment({
        ideaID: req.body.idIdea,
        author: req.session.user._id,
        comment: req.body.comment,
    })
    let aIdea = await idea.findById( req.body.idIdea)
    aIdea.comment +=1;
    aIdea = aIdea.save();
    newComment = await newComment.save();
    //console.log(newComment.comment);
    res.redirect('../viewCategoryDetail?id=' + id);
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

exports.viewLatestComment = async (req, res) => {
    let listComments = await comment.find()
    let len_comments = listComments.length;
    let last_comments = [];
    if(len_comments == 0){
        last_comments = [];
    }
    else if(len_comments < 5){
        last_comments = listComments.reverse();
    }
    else{
        last_comments = listComments.slice(-5, len_comments).reverse();
    }
    res.render('staff/viewLatestComments',{listComments: last_comments});
}