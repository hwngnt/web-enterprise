const Account = require('../models/user');
const bcrypt = require('bcryptjs');
const category = require('../models/category');
const idea = require('../models/ideas');

exports.getQAM = async (req, res) => {
    res.render('qam/qam_index', { loginName: req.session.email })
}

exports.getAddCategory = async (req, res) => {
    res.render('qam/qamAddCategory', { loginName: req.session.email })
}

exports.doAddCategory = async (req, res) => {
    const fs = require("fs");
    let date = new Date();
    let newDate = new Date();
    if (date.getMonth() == '1' || '3' || '5' || '7' || '8' || '10' || '12') {
        if (date.getDate() + 14 > 31) {
            let tempDate = 14 - (31 - date.getDate() + 1);
            let tempMonth = date.getMonth() + 1;
            newDate.setDate(tempDate);
            newDate.setMonth(tempMonth);
        }
        else {
            newDate.setDate(date.getDate() + 14)
        }
    }
    else if (date.getMonth() == '4' || '6' || '9' || '11') {
        if (date.getDate() + 14 > 30) {
            let tempDate = 14 - (30 - date.getDate() + 1);
            let tempMonth = date.getMonth() + 1;
            newDate.setDate(tempDate);
            newDate.setMonth(tempMonth);
        }
        else {
            newDate.setDate(date.getDate() + 14)
        }
    }
    else if (date.getMonth() == '2') {
        if (date.getDate() + 14 > 28) {
            let tempDate = 14 - (28 - date.getDate() + 1);
            let tempMonth = date.getMonth() + 1;
            newDate.setDate(tempDate);
            newDate.setMonth(tempMonth);
        }
        else {
            newDate.setDate(date.getDate() + 14)
        }
    }
    console.log(req.body.name)
    let newCategory = new category({
        name: req.body.name,
        description: req.body.description,
        dateStart: date,
        dateEnd: newDate,
        url: 'public/folder/' + req.body.name
    })
    fs.access('public/folder/' + req.body.name, (error) => {
        // To check if the given directory 
        // already exists or not
        if (error) {
            // If current directory does not exist
            // then create it
            fs.mkdir('public/folder/' + req.body.name, (error) => {
                if (error) {
                    console.log(error);
                } else {
                    console.log("New Directory created successfully !!");
                }
            });
        } else {
            console.log("Given Directory already exists !!");
        }
    });
    newCategory = await newCategory.save();
    res.redirect('/qam_index');
}

exports.getViewCategory = async (req, res) => {
    let listCategory = await category.find();
    res.render('qam/qamViewCategory', { listCategory: listCategory, loginName: req.session.email })
}

exports.getCategoryDetail = async (req, res) => {
    let id;
    let sortBy;
    if (req.query.id === undefined) {
        id = req.body.idCategory;
        sortBy = req.body.sortBy;
    } else {
        id = req.query.id;
    }
    // let id = req.query.id;
    let listFiles = [];
    try {
        let listIdeas = await idea.find({ categoryID: id }).populate('comments')
        let aCategory = await category.findById(id);
        let tempDate = new Date();
        let compare = tempDate > aCategory.dateEnd;
        const fs = require("fs");
        var counter = 0;
        function callBack() {
            if (listIdeas.length === counter) {
                if (sortBy === 'like') {
                    listFiles.sort((a, b) => {
                        if (b.idea.like < a.idea.like) {
                            return -1;
                        }
                        else if (b.idea.like > a.idea.like) {
                            return 1;
                        } else {
                            if (a.idea._id < b.idea._id) {
                                return -1;
                            }
                            if (a.idea._id > b.idea._id) {
                                return 1;
                            }
                        };
                    });
                    console.log('like');
                }
                else if (sortBy === 'comment') {
                    listFiles.sort((a, b) => {
                        if (b.idea.comments.length < a.idea.comments.length) {
                            return -1;
                        }
                        else if (b.idea.comments.length > a.idea.comments.length) {
                            return 1;
                        } else {
                            if (a.idea._id < b.idea._id) {
                                return -1;
                            }
                            if (a.idea._id > b.idea._id) {
                                return 1;
                            }
                        };
                    });
                    console.log('comment');
                }
                else if (sortBy === 'time') {
                    listFiles.sort((a, b) => {
                        const A = new Date(a.idea.time)
                        const B = new Date(b.idea.time)
                        if (A < B) {
                            return 1;
                        }
                        else if (A > B) {
                            return -1;
                        }
                        else{
                            if (a.idea._id < b.idea._id) {
                                return -1;
                            }
                            if (a.idea._id > b.idea._id) {
                                return 1;
                            }
                        };
                    });
                    console.log('time');
                } else {
                    listFiles.sort((a, b) => {
                        if (a.idea._id < b.idea._id) {
                            return -1;
                        }
                        if (a.idea._id > b.idea._id) {
                            return 1;
                        }
                    });
                    console.log('id');
                }
            };
        };
        listIdeas.forEach(async (i) => {
            fs.readdir(i.url, (err, files) => {
                listFiles.push({
                    counter: counter,
                    value: files,
                    linkValue: i.url.slice(7),
                    idea: i
                });
                counter = counter + 1;
                callBack();
            });

        })
        //res.render('admin/viewCategoryDetail', { idCategory: id, listFiles: listFiles, nameIdea: nameIdea, listComment: listComment, compare: compare, loginName: req.session.email });
        res.render('qam/qamViewCategoryDetail', { idCategory: id, listFiles: listFiles, aCategory: aCategory, compare: compare, loginName: req.session.email });
    } catch (e) {
        console.log(e);
        res.render('qam/qamViewCategoryDetail', { idCategory: id, listFiles: listFiles, aCategory: aCategory, compare: compare, loginName: req.session.email });
    }
}

exports.deleteCategory = async (req, res) => {
    let id = req.query.id;
    let dir = await category.findById(id);
    category.findByIdAndRemove(id).then(data = {});
    const path = 'public/folder/'+dir.name
    // include node fs module
    const fs = require('fs');
    fs.rm(path, { recursive: true }, () => console.log('delete done'));
    res.redirect('/qam/qamViewCategory');
}


exports.viewLastestIdeas = async (req, res) => {
    const fs = require("fs");
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
    res.render('qam/viewLastestIdeas', { lastestIdeas: lastestIdeas, loginName: req.session.email });
}

exports.editCategory = async (req,  res) => {
    let id = req.query.id;
    let aCategory = await category.findById(id);
    res.render('qam/qamEditCategory', { aCategory: aCategory, loginName: req.session.email })
}

exports.updateCategory = async (req, res) => {
    let id = req.body.id;
    let aCategory = await category.findById(id);
    console.log(aCategory)
    aCategory.name = req.body.name;
    aCategory.description = req.body.description;
    console.log(req.body.name)
    console.log(req.body.description)
    try {
        aCategory = await aCategory.save();
        res.redirect('/qam/qamViewCategory');
    }
    catch (error) {
        console.log(error);
        res.redirect('/qam/qamViewCategory');
    }
}

exports.getMostViewed = async (req, res) => {
    const fs = require("fs");
    let listIdeas = await idea.find();
    let n_ideas = listIdeas.length;
    let visited_max = [];
    for (let m = 0; m < n_ideas; m++) {
        visited_max.push(0);
    }
    let countViews = [];
    // console.log(listIdeas);
    for (let idea of listIdeas) {
        countViews.push(idea.like + idea.dislike + idea.comments.length);
    }
    // console.log(countViews);
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
    // console.log(top5Views);
    let mostViewedIdeas = [];
    await top5Views.forEach(async (i) => {
        console.log(i);
        fs.readdir(i.url, (err, files) => {
            mostViewedIdeas.push({
                id: i._id,
                value: files,
                linkValue: i.url.slice(7),
                name: i.name,
                comment: i.comments.length,
                idCategory: i.categoryID,
                n_likes: i.like,
                n_dislikes: i.dislike,
                time: i.time
            });
        });
    });
    res.render('qam/qamMostViewed', { mostViewedIdeas: mostViewedIdeas, loginName: req.session.email });
}