const Account = require('../models/user');
const bcrypt = require('bcryptjs');
const Category = require('../models/category');
const idea = require('../models/ideas');
const User = require('../models/user');
const Comment = require('../models/comments');
const AdmZip = require('adm-zip');
var mongoose = require('mongoose');
const createCsvWriter = require('csv-writer').createObjectCsvWriter;

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
    let newCategory = new Category({
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
    let listCategory = await Category.find();
    let tempDate = new Date();
    let listCompare = [];
    listCategory.forEach(element =>{
        listCompare.push({
            compare: tempDate > element.dateEnd,
            category: element
        });
    })
    // console.log(listCompare)
    // let compare = tempDate > aCategory.dateEnd;
    res.render('qam/qamViewCategory', { listCompare: listCompare, loginName: req.session.email })
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
        let aCategory = await Category.findById(id);
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
                    // console.log('like');
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
                    // console.log('comment');
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
                        else {
                            if (a.idea._id < b.idea._id) {
                                return -1;
                            }
                            if (a.idea._id > b.idea._id) {
                                return 1;
                            }
                        };
                    });
                    // console.log('time');
                } else {
                    listFiles.sort((a, b) => {
                        if (a.idea._id < b.idea._id) {
                            return -1;
                        }
                        if (a.idea._id > b.idea._id) {
                            return 1;
                        }
                    });
                    // console.log('id');
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
                // console.log(listFiles)
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
    let dir = await Category.findById(id);
    Category.findByIdAndRemove(id).then(data = {});
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

exports.editCategory = async (req, res) => {
    let id = req.query.id;
    let aCategory = await Category.findById(id);
    res.render('qam/qamEditCategory', { aCategory: aCategory, loginName: req.session.email })
}

exports.updateCategory = async (req, res) => {
    let id = req.body.id;
    let aCategory = await Category.findById(id);
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

exports.downloadZip = async (req, res) => {
    const fs = require("fs");
    let id = req.query.id;
    let aCategory = await Category.findById(id);
    let folderpath = (__dirname.slice(0,-10) + aCategory.url)

    var zp = new AdmZip();
    zp.addLocalFolder(folderpath);
    // here we assigned the name to our downloaded file!
    const file_after_download = 'downloaded_file.zip';
    // toBuffer() is used to read the data and save it
    // for downloading process!
    const data = zp.toBuffer();
    res.set('Content-Type', 'application/octet-stream');
    res.set('Content-Disposition', `attachment; filename=${file_after_download}`);
    res.set('Content-Length', data.length);
    res.send(data);
}

exports.downloadCSV = async (req, res) => {
    let id = req.query.id;
    let aCategory = await Category.findById(id);
    const csvWriter = createCsvWriter({
        path: aCategory.name + '.csv',
        header: [
          {id: '_id', title: 'ID'},
          {id: 'category', title: 'Category Name'},
          {id: 'name', title: 'Name'},
          {id: 'url', title: 'URL'},
          {id: 'author', title: 'Author'},
          {id: 'time', title: 'Time'},
          {id: 'like', title: 'Like'},
          {id: 'dislike', title: 'Dislike'},
          {id: 'comments', title: 'Comments'},
          {id: '__v', title: '__v'}
        ]
    });
    let listIdeas = await idea.find({ categoryID: id }).populate('categoryID').populate('comments')
    // console.log(listIdeas)
    let CSVAttribute = [];
    listIdeas.forEach(element => {
        // let categoryName = Category.find({_id: mongoose.Types.ObjectId(element.categoryID.toString())})
        // let authorName = User.findById(element.author)
        // let categoryName = element.category
        console.log(element)
        // console.log(element.comments.comment)
        // console.log(element)
        // let listComment = []
        // for (let obj of element.comments) {
        //     if(obj != undefined){
        //         listComment.push(obj)
        //     }
        //     else{
        //         listComment=[]
        //     }
        // }
        // console.log(listComment)
        // let listCommentText = []
        // for (let obj of listComment) {
        //     if(obj != undefined){
        //         temp = Comment.findById(obj)
        //         console.log(temp)
        //         listCommentText.push(temp.comment)
        //         console.log(temp.comment)
        //     }
        //     else{
        //         listCommentText=[]
        //     }
        // }
        CSVAttribute.push({
            _id: element._id,
            // category: categoryName.name,
            name: element.name,
            url: element.url,
            // author: authorName.email,
            time: element.time,
            like: element.like,
            dislike: element.dislike,
            // comment: listCommentText
        })
        listComment = []
        // console.log("---------")
    })
    // console.log(CSVAttribute)
    // const data = listIdeas;
    // csvWriter
    // .writeRecords(data)
    // .then(()=> console.log('The CSV file was written successfully'));
}
exports.numberOfIdeasByYear = async (req, res) => {
    let yearStart = 2020;
    let yearEnd = 2022;
    if (req.body == {}) {
        //console.log(req.body)
        yearStart = parseInt(req.body.from);
        yearEnd = parseInt(req.body.to);
    }
    let dateStart;
    let dateEnd;
    let listYear = [];
    let i = yearStart;
    async function loop() {
        if (i <= yearEnd) {
            dateStart = new Date(i + "-01-01");
            dateEnd = new Date(i + "-12-31");
            console.log(dateEnd)
            let noIdeas = await idea.find({
                "time": {
                    $gte: dateStart,
                    $lt: dateEnd
                }
            }).count();
            // console.log(i);
            // console.log(noIdeas);
            listYear.push({
                x: i,
                value: noIdeas
            })
            i += 1;
            // console.log(listYear);
            loop();

        } else {
            console.log(listYear);
            res.render('qam/numberOfIdeasByYear', { listYear: JSON.stringify(listYear), loginName: req.session.email })
        }
    }
    loop();
}
exports.numberOfIdeasByYear2 = async (req, res) => {
    let year = 2022;
    console.log(req.body.year);
    if (req.body.year != undefined) {
        year = parseInt(req.body.year);
    }
    let dateS = new Date(year + "-01-01");
    let dateE = new Date(year + "-12-31");
    let data = [];
    console.log(dateE)
    let listCategory = await Category.find({
        "dateStart": {
            $gte: dateS,
            $lt: dateE
        }
    });
    let counter = 0;
    listCategory.forEach(async (i) => {
        let noIdeas = await idea.find({
            "categoryID": i._id, "time": {
                $gte: dateS,
                $lt: dateE
            }
        }).count();
        data.push({
            x: i.name,
            value: noIdeas
        });
        counter += 1;
        if (counter === listCategory.length) {
            console.log(data);
            res.render('qam/numberOfIdeasByYear2', { data: JSON.stringify(data), loginName: req.session.email })
        }
    });
}
exports.numberOfPeople = async (req, res) => {
    let role = ['QAmanager', 'QAcoordinator', 'Staff'];
    let data = [];
    let counter = 0;
    role.forEach(async (i) => {
        let noPeople = await Account.find({ "role": i }).count();
        data.push({
            x: i,
            value: noPeople
        });
        counter += 1;
        if (counter === 3) {
            console.log(data);
            res.render('qam/numberOfPeoPle', { data: JSON.stringify(data), loginName: req.session.email })
        }
    });
}