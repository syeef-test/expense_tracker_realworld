const express = require('express');

const userController = require('../controllers/userController');

const authenticate = require('../middleware/auth');



const router = express.Router();

router.post('/signup',userController.postSignup);
router.post('/login',userController.postLogin);




module.exports = router;