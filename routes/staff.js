const express = require('express');
const router = express.Router();
const multer = require('multer');
const mongoose = require('mongoose');
const staffController = require('../controller/staff');
const { isStaff } = require("../middleware/auth");


router.get('/staff/addIdea', staffController.addIdea);
router.post('/staff/doAddIdea', staffController.doAddIdea);
router.post('/staff/doAddFile', function (req, res, file) {

    try{
        const  storage = multer.diskStorage({
            destination:function(req, file, callback){
                callback(null, 'public/folder/hung-cho/hoangcho23');
                console.log(req.body.path)
            },
            //add back the extension
            filename:function(req, file, callback){
                callback(null, Date.now()+file.originalname);
            },
        });
        const upload = multer({ storage: storage });
        upload.single('ideas');
        console.log('a')
    }catch(err){
        console.log(err)
    }

    
});
module.exports = router;