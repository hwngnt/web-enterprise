const Account = require('../models/user');
const bcrypt = require('bcryptjs');
const category = require('../models/category');

exports.getQAM = async (req, res) => {
    res.render('qam/qam_index', { loginName: req.session.email })
}

exports.getQAMAddCategory = async (req, res) => {
    res.render('qam/qamAddCategory', { loginName: req.session.email })
}

exports.doQAMAddCategory = async (req, res) => {
    const fs = require("fs");
    let date = new Date();
    let newDate = new Date();
    if (date.getMonth()=='1'||'3'||'5'||'7'||'8'||'10'||'12'){
        if (date.getDate()+14>31){
            let tempDate = 14 - (31 - date.getDate() + 1);
            let tempMonth = date.getMonth() + 1;
            newDate.setDate(tempDate);
            newDate.setMonth(tempMonth);
        }
        else{
            newDate.setDate(date.getDate()+14)
        }
    }
    else if (date.getMonth()=='4'||'6'||'9'||'11'){
        if (date.getDate()+14>30){
            let tempDate = 14 - (30 - date.getDate() + 1);
            let tempMonth = date.getMonth() + 1;
            newDate.setDate(tempDate);
            newDate.setMonth(tempMonth);
        }
        else{
            newDate.setDate(date.getDate()+14)
        }
    }
    else if (date.getMonth() == '2'){
        if (date.getDate()+14>28){
            let tempDate = 14 - (28 - date.getDate() + 1);
            let tempMonth = date.getMonth() + 1;
            newDate.setDate(tempDate);
            newDate.setMonth(tempMonth);
        }
        else{
            newDate.setDate(date.getDate()+14)
        }
    }
    console.log(req.body.name)
    let newCategory = new category({
        name: req.body.name,
        description: req.body.description,
        dateStart: date,
        dateEnd: newDate,
        url : 'public/folder/' + req.body.name
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