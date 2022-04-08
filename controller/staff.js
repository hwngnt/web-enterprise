const validation = require('./validation');
const bcrypt = require('bcryptjs');
const fs = require("fs");
const idea = require('../models/ideas');
const category = require('../models/category');
const comment = require('../models/comments');
const multer = require('multer');
const { redirect } = require('express/lib/response');
const likes = require('../models/likes');
const dislikes = require('../models/dislikes');
const Staff = require('../models/staff');

exports.getStaff = async (req, res) => {
    res.render('staff/staff', { loginName: req.session.email })
}

exports.addIdea = async (req, res) => {
    var id = req.query.id;
    res.render('staff/addIdeas', { idCategory: id, loginName: req.session.email })
}
exports.doAddIdea = async (req, res) => {
    const fs = require("fs");
    req.body.name = req.body.name.replace(" ", "_");
    var idCategory = req.body.idCategory;
    let aCategory = await category.findById(idCategory);
    let path = aCategory.url + '/' + req.body.name;
    let count = 0;
    function loop() {
        console.log(path);
        fs.access(path, (error) => {
            if (error) {
                fs.mkdir(path, (error) => {
                    if (error) {
                        console.log(error);
                    } else {
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
                        console.log("New Directory created successfully !!");
                    }
                });
                res.render('staff/addFileToIdea', { idCategory: idCategory, path: path, loginName: req.session.email });
            } else {
                console.log("Given Directory already exists !!");
                count += 1;
                path = path + "_(" + count + ")";
                req.body.name = req.body.name + "_(" + count + ")";
                loop();
            }
        });
    };
    await loop();
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
    let id = req.query.id;
    let listFiles = [];
    try {
        let listIdeas = await idea.find({ categoryID: id }).populate('comments')
        let email = req.session.email;
        let staff = await Staff.findOne({ email: email });
        let listLikes = await likes.find({ staffID: { $all: staff._id } });
        let listDislikes = await dislikes.find({ staffID: { $all: staff._id } });;
        let likedIDs = [];
        for (let like of listLikes) {
            likedIDs.push(like.ideaID);
        }
        let dislikeIDs = [];
        for (let dislike of listDislikes) {
            dislikeIDs.push(dislike.ideaID);
        }
        let aCategory = await category.findById(id);
        let tempDate = new Date();
        let compare = tempDate > aCategory.dateEnd;
        const fs = require("fs");

        await listIdeas.forEach(async (i) => {
            fs.readdir(i.url, (err, files) => {
                listFiles.push({
                    value: files,
                    linkValue: i.url.slice(7),
                    idea: i,
                    idLikeds: likedIDs,
                    idDislikes: dislikeIDs,
                });
            });
        })
        // listFiles.countDocuments((err, count)=>{
        //     console.log(err)
        // })
        res.render('staff/viewCategoryDetail', { idCategory: id, listFiles: listFiles, compare: compare, loginName: req.session.email });
    } catch (e) {
        console.log(e);
        res.render('staff/viewCategoryDetail', { idCategory: id, listFiles: listFiles, loginName: req.session.email });
    }
}

exports.doComment = async (req, res) => {
    let id = req.body.idCategory;
    //console.log(req.body.idCategory);
    newComment = new comment({
        ideaID: req.body.idIdea,
        author: req.session.user._id,
        comment: req.body.comment,
    });
    newComment = await newComment.save();
    let aIdea = await idea.findById(req.body.idIdea)
    aIdea.comments.push(newComment);
    aIdea = await aIdea.save();

    //console.log(newComment.comment);
    res.redirect('../viewCategoryDetail?id=' + id);
}


exports.addLike = async (req, res) => {
    let id = req.body.idCategory;
    let ideaID = req.body.ideaID;
    let email = req.session.email;
    let staff = await Staff.findOne({ email: email });
    let n_staffs = 0;
    try {
        let staffID = staff._id;
        let checkExistedStaff = false;
        await likes.findOne({ ideaID: ideaID }).then(data => {
            if (data) {
                n_staffs = data.staffID.length;
                try {
                    let idxRemove = -1;
                    for (let i = 0; i < data.staffID.length; i++) {
                        if (staffID.equals(data.staffID[i])) {
                            idxRemove = i;
                            checkExistedStaff = true;
                            break;
                        }
                    }
                    if (checkExistedStaff) {
                        data.staffID.splice(idxRemove, 1);
                        console.log('Removed existed staff liked idea');
                        n_staffs -= 1;
                        data.save();
                    } else {
                        data.staffID.push(staffID);
                        n_staffs += 1;
                        data.save();
                        console.log('Add a new staff');
                    }
                } catch (e) {
                    console.log(e);
                }

            }
            else {
                newLike = new likes({
                    ideaID: ideaID,
                    staffID: staffID
                })
                newLike.save();
                n_staffs += 1;
                console.log('Add new like');
            }
        });
    }
    catch (e) {
        console.log(e);
    }
    let objIdea = await idea.findById(ideaID);
    objIdea.like = n_staffs;
    await objIdea.save();
    res.redirect('viewCategoryDetail?id=' + id);
}

exports.addDislike = async (req, res) => {
    let id = req.body.idCategory;
    let ideaID = req.body.ideaID;
    let email = req.session.email;
    let staff = await Staff.findOne({ email: email });

    let n_staffs = 0;
    try {
        let staffID = staff._id;
        console.log(staffID);
        let checkExistedStaff = false;
        await dislikes.findOne({ ideaID: ideaID }).then(data => {
            if (data) {
                n_staffs = data.staffID.length;
                try {
                    let idxRemove = -1;
                    for (let i = 0; i < data.staffID.length; i++) {
                        if (staffID.equals(data.staffID[i])) {
                            idxRemove = i;
                            checkExistedStaff = true;
                            break;
                        }
                    }
                    if (checkExistedStaff) {
                        data.staffID.splice(idxRemove, 1);
                        n_staffs -= 1;
                        console.log('Removed existed staff disliked idea');
                        data.save();

                    } else {
                        data.staffID.push(staffID);
                        data.save();
                        n_staffs += 1;
                        console.log('Add a new staff');
                    }
                } catch (e) {
                    console.log(e);
                }
            }
            else {
                newDislike = new dislikes({
                    ideaID: ideaID,
                    staffID: staffID
                })
                newDislike.save();
                n_staffs += 1;
                console.log('Add new dislike');
            }
        });
    }
    catch (e) {
        console.log(e);
    }
    let objIdea = await idea.findOne({ _id: ideaID });
    objIdea.dislike = n_staffs;
    await objIdea.save();
    res.redirect('viewCategoryDetail?id=' + id);
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

    let lastestIdeas = [];
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
    res.render('staff/viewLastestIdeas', { listIdeas: last_ideas, lastestIdeas: lastestIdeas, loginName: req.session.email });
}

exports.viewLatestComment = async (req, res) => {
    let listComments = await comment.find()
    let len_comments = listComments.length;
    let last_comments = [];
    if (len_comments == 0) {
        last_comments = [];
    }
    else if (len_comments < 5) {
        last_comments = listComments.reverse();
    }
    else {
        last_comments = listComments.slice(-5, len_comments).reverse();
    }

    res.render('staff/viewLatestComments', { listComments: last_comments, loginName: req.session.email });
}

exports.viewMostViewedIdeas = async (req, res) => {
    let listIdeas = await idea.find();
    let n_ideas = listIdeas.length;
    let visited_max = [];
    for (let m = 0; m < n_ideas; m++) {
        visited_max.push(0);
    }
    let countViews = [];
    console.log(listIdeas);
    for (let idea of listIdeas) {
        countViews.push(idea.like + idea.dislike + idea.comment);
    }
    console.log(countViews);
    let top5Views = [];
    let i = 0;
    while (i < 5) {
        let fake_max = -1;
        let idx_max = -1;
        let j = 0;
        while (j < n_ideas) {
            if (visited_max[j] == 0 && countViews[j] >= fake_max) {
                fake_max = countViews[j];
                idx_max = j;
            }
            j++;
        }
        visited_max[idx_max] = 1;
        top5Views.push(listIdeas[idx_max]);
        i++;
    }
    let mostViewedIdeas = [];
    await top5Views.forEach(async (i) => {
        fs.readdir(i.url, (err, files) => {
            mostViewedIdeas.push({
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
    res.render('staff/viewMostViewedIdeas', { mostViewedIdeas: mostViewedIdeas, loginName: req.session.email });
}