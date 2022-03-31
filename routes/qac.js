const express = require('express');
const router = express.Router();
const qacController = require('../controller/qac');

router.get('/qac',qacController.getQAC);

router.get('/qac/viewLastestComment',qacController.viewLastestComment);

router.get('/qac/mostViewedIdeas',qacController.mostViewIdeas);

router.get('/qac/viewLastestIdeas',qacController.viewLastestIdeas);
module.exports = router;