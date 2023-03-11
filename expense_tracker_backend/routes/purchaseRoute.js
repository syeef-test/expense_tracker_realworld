const express = require('express');
const authenticate = require('../middleware/auth');
const purchaseController = require('../controllers/purchaseController');

const router = express.Router();

router.get('/premiummembership',authenticate.authenticate,purchaseController.purchasepremium);
router.post('/updatetransactionstatus',authenticate.authenticate,purchaseController.updateTransaction);


module.exports = router;