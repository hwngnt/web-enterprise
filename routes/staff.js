const express = require('express');
const router = express.Router();
const multer = require('multer');
const mongoose = require('mongoose');
const staffController = require('../controller/staff');
const { isStaff } = require("../middleware/auth");
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, req.body.path),
            consolelog(req.body.path)

    },
    filename: function (req, file, cb) {
        x = file.originalname; //+path.extname(file.originalname);
        cb(null, x);
    }
});
var upload = multer({ storage: storage });


router.get('/staff/addIdea', staffController.addIdea);
router.post('/staff/doAddIdea', staffController.doAddIdea);
router.post('/staff/doAddFile', function (req, res) {
    console.log(req.body.path)
    const  storage = multer.diskStorage({
        destination:function(req, file, callback){
            callback(null, + 'public/folder/hung-cho/hoangcho23');
        },
        //add back the extension
        filename:function(req, file, callback){
            callback(null, Date.now()+file.originalname);
        },
    });
    const upload = multer({ storage: storage });

    upload.single('ideas');
    console.log('a')
});
module.exports = router;