const express = require('express');

const passwordController = require('../controllers/passwordController');

const router = express.Router();

router.post('/forgotpassword',passwordController.forgotPassword);
router.get('/resetpassword/:uuid',passwordController.checkPasswordLinkStatus);

router.get('/updatepassword/:resetpasswordid', passwordController.updatepassword);



module.exports = router;