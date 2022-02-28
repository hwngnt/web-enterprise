const express = require('express');
const router = express.Router();
const multer = require('multer');
const mongoose = require('mongoose');
const qamController = require('../controller/qam');
const { isQAM } = require("../middleware/auth");

router.get('/qam_index', isQAM, qamController.getQAM);
module.exports = router;