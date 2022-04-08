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

router.get('/qam/viewLastestIdeas', qamController.viewLastestIdeas);

router.get('/qam/qamEditCategory', qamController.editCategory);
router.post('/qam/doEditCategory', qamController.updateCategory);
router.get('/qam/viewMostViewed', qamController.getMostViewed);
router.get('/qam/downloadZip', qamController.downloadZip);

router.get('/qam/numberOfIdeasByYear', qamController.numberOfIdeasByYear);
router.post('/qam/numberOfIdeasByYear', qamController.numberOfIdeasByYear);
router.get('/qam/numberOfIdeasByYear2', qamController.numberOfIdeasByYear2);
router.post('/qam/numberOfIdeasByYear2', qamController.numberOfIdeasByYear2);
router.get('/qam/numberOfPeople', qamController.numberOfPeople);
module.exports = router;