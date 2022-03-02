const express = require('express');
const router = express.Router();
const qacController = require('../controller/qac');

router.get('/qac',qacController.getQAC);

router.get('/qac/most_popular_ideas',qacController.mostPopularIdeas);

router.get('/qac/most_view_ideas',qacController.mostViewIdeas);
module.exports = router;