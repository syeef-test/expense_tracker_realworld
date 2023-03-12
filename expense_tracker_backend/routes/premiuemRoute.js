const express = require('express');
const authenticate = require('../middleware/auth');

const premiuemController = require('../controllers/premiuemFeature');

const router = express.Router();

router.get('/showLeaderBoard',authenticate.authenticate,premiuemController.getUserLeaderBoard);


module.exports = router;