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
router.get('/staff/addIdea',isStaff, staffController.addIdea);
router.post('/staff/doAddIdea',isStaff, staffController.doAddIdea);
router.post('/staff/doAddFile',isStaff, uploadQAmanager.any('ideas'), staffController.doAddFile);
router.get('/staff/viewLastestIdeas', staffController.viewLastestIdeas);

router.get('/staff/viewSubmittedIdeas', staffController.viewSubmittedIdeas);
router.get('/staff/viewCategoryDetail', staffController.viewCategoryDetail);
router.post('/staff/viewCategoryDetail', staffController.viewCategoryDetail);
router.post('/staff/viewCategoryDetail/Comment', staffController.doComment);

router.post('/staff/addLike', staffController.addLike);
router.post('/staff/addDislike', staffController.addDislike);
module.exports = router;