const express = require('express');
const authenticate = require('../middleware/auth');

const expenseController = require('../controllers/expenseController');

const router = express.Router();

router.post('/addexpense', authenticate.authenticate, expenseController.addExpense);
router.delete('/deleteExpense/:id', authenticate.authenticate, expenseController.deleteExpense);
router.get('/get_expense', authenticate.authenticate, expenseController.getExpense);


router.get('/isPremiuemUser',authenticate.authenticate,expenseController.isPremiuemUser);


module.exports = router;