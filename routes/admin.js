const express = require('express');
const router = express.Router();
const multer = require('multer');
const mongoose = require('mongoose');
const adminController = require('../controller/admin');
const { isAdmin } = require("../middleware/auth");
var bodyParser = require('body-parser')
var jsonParser = bodyParser.json();

router.get('/admin', adminController.getAdmin);
router.get('/admin/changePassword', isAdmin, adminController.changePassword)
router.post('/admin/doChangePassword', isAdmin, adminController.doChangePassword)

//QAmanager
const storageQAmanager = multer.diskStorage({
    destination:function(req, file, callback){
        callback(null, 'public/uploads/QAmanager');
        console.log(req.body)
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

router.get('/admin/viewQualityAssuranceManager', adminController.viewQAmanager);
router.get('/admin/addQualityAssuranceManager', adminController.addQAmanager);
router.post('/admin/doAddQualityAssuranceManager', uploadQAmanager.single('picture'), adminController.doAddQAmanager);
router.get('/admin/deleteQualityAssuranceManager', adminController.deleteQAmanager);
router.get('/admin/editQualityAssuranceManager', adminController.editQAmanager);
router.post('/admin/doEditQualityAssuranceManager',uploadQAmanager.single('picture'), adminController.doEditQAmanager);
router.post('/admin/searchQualityAssuranceManager', adminController.searchQAmanager);



//QAcoordinator
const storageQAcoordinator = multer.diskStorage({
    destination:function(req, file, callback){
        callback(null, 'public/uploads/QAcoordinator');
    },
    //add back the extension
    filename:function(req, file, callback){
        callback(null, Date.now()+file.originalname);
    },
})

const uploadQAcoordinator = multer({
    storage:storageQAcoordinator,
    limits:{
        fieldSize:1024*1024*3
    },
})
router.get('/admin/viewQualityAssuranceCoordinator', adminController.viewQAcoordinator);
router.get('/admin/addQualityAssuranceCoordinator', adminController.addQAcoordinator);
router.post('/admin/doAddQualityAssuranceCoordinator', uploadQAcoordinator.single('picture'), adminController.doAddQAcoordinator);
router.get('/admin/editQualityAssuranceCoordinator', adminController.editQAcoordinator);
router.post('/admin/doEditQualityAssuranceCoordinator',uploadQAcoordinator.single('picture'), adminController.doEditQAcoordinator);
router.get('/admin/deleteQualityAssuranceCoordinator', adminController.deleteQAcoordinator);
router.post('/admin/searchQualityAssuranceCoordinator', adminController.searchQAcoordinator);

//Staff
const storageStaff = multer.diskStorage({
    destination:function(req, file, callback){
        callback(null, 'public/uploads/staff');
    },
    //add back the extension
    filename:function(req, file, callback){
        callback(null, Date.now()+file.originalname);
    },
});

const uploadStaff = multer({
    storage:storageStaff,
    limits:{
        fieldSize:1024*1024*3
    },
});
router.get('/admin/viewStaff', adminController.viewStaff);
router.get('/admin/addStaff', adminController.addStaff);
router.post('/admin/doAddStaff', uploadStaff.single('picture'), adminController.doAddStaff);
router.get('/admin/editStaff', adminController.editStaff);
router.post('/admin/doEditStaff',uploadStaff.single('picture'), adminController.doEditStaff);
router.get('/admin/deleteStaff', adminController.deleteStaff);
router.post('/admin/searchStaff', adminController.searchStaff);

router.get('/admin/viewCategory', adminController.viewCategory);
router.post('/admin/searchCategory', adminController.searchCategory);
router.get('/admin/category/edit', adminController.editDate);
router.post('/admin/doEditCategory', adminController.doEditDate);


router.get('/admin/viewSubmittedIdeas', adminController.viewSubmittedIdeas);
router.get('/admin/viewCategoryDetail', adminController.viewCategoryDetail);
router.post('/admin/viewCategoryDetail', adminController.viewCategoryDetail);
module.exports = router;