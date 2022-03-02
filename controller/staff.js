const validation = require('./validation');
const bcrypt = require('bcryptjs');
const idea = require('../models/ideas');
const category = require('../models/category');
const multer = require('multer');
const { redirect } = require('express/lib/response');


exports.getStaff = async (req, res) => {
    res.render('staff/staff', { loginName: req.session.email })
}

exports.addIdea = async (req,  res) => {
    res.render('staff/addIdeas', { loginName: req.session.email })
}
exports.doAddIdea = async (req, res) => {
    const fs = require("fs");
    var idtest = "621e3fd1f3e6c57393eae6b1"
    let aCategory = await category.findById(idtest);
    let path = aCategory.url + '/' + req.body.name;
    
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
    res.render('staff/addFileToIdea', { path: path, loginName: req.session.email })
}
exports.doAddFile = async (req, res) => {
    res.render('staff/staff', { loginName: req.session.email })
}
