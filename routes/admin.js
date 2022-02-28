const express = require('express');
const router = express.Router();
const multer = require('multer');
const mongoose = require('mongoose');
const adminController = require('../controller/admin');
const { isAdmin } = require("../middleware/auth");

router.get('/admin', adminController.getAdmin);

//QAmanager
const storageQAmanager = multer.diskStorage({
    destination:function(req, file, callback){
        callback(null, 'public/uploads/QAmanager');
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
// router.get('/admin/deleteQualityAssuranceManager', adminController.deleteQAmanager);
// router.post('/admin/searchQualityAssuranceManager', adminController.searchQAmanager);



//QAcoordinator
router.get('admin/viewQualityAssuranceCoordinator', adminController.viewQAcoordinator);

module.exports = router;