const express = require('express');
const router = express.Router();
const multer = require('multer');
const mongoose = require('mongoose');
const qamController = require('../controller/qam');
const { isQAM } = require("../middleware/auth");

// router.get('/qam_index', isQAM, qamController.getQAM);
router.get('/qam_index', qamController.getQAM);
router.get('/qam/qamAddCategory', qamController.getAddCategory);
router.post('/qam/doAddCategory', qamController.doAddCategory);
router.get('/qam/qamViewCategory', qamController.getViewCategory);
router.get('/qam/qamViewCategoryDetail', qamController.getCategoryDetail);
router.get('/qam/qamDeleteCategory', qamController.deleteCategory);
module.exports = router;