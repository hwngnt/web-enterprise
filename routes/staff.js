const express = require('express');
const router = express.Router();
const multer = require('multer');
const mongoose = require('mongoose');
const staffController = require('../controller/staff');
const { isStaff } = require("../middleware/auth");

const storageQAmanager = multer.diskStorage({
    destination:function(req, file, callback){
        callback(null, req.body.path);
        // console.log(req.body)
    },
    //add back the extension
    filename:function(req, file, callback){
        callback(null, Date.now()+file.originalname);
    },
})

const uploadQAmanager = multer({
    storage:storageQAmanager,
    limits:{
        fieldSize:1024*1024*3
    },
})
router.get('/staff', staffController.getStaff);
router.get('/staff/addIdea', staffController.addIdea);
router.post('/staff/doAddIdea', staffController.doAddIdea);
router.post('/staff/doAddFile', uploadQAmanager.any('ideas'), staffController.doAddFile);
router.get('/staff/viewLastestIdeas', staffController.viewLastestIdeas);

router.get('/staff/viewSubmittedIdeas', staffController.viewSubmittedIdeas);
router.get('/staff/viewCategoryDetail', staffController.viewCategoryDetail);
router.post('/staff/viewCategoryDetail/Comment', staffController.doComment);
module.exports = router;