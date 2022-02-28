const express = require('express');
const router = express.Router();
const multer = require('multer');
const mongoose = require('mongoose');
const adminController = require('../controller/admin');
const { isAdmin } = require("../middleware/auth");

router.get('/admin', adminController.getAdmin);

router.get('/admin/ViewQualityAssuranceManager', adminController.viewQAmanager);

router.get('admin/ViewQualityAssuranceCoordinator', adminController.viewQAcoordinator);

module.exports = router;