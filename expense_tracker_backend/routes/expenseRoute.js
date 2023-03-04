const express = require('express');

const expenseController = require('../controllers/expenseController');

const router = express.Router();

router.post('/addexpense',expenseController.addExpense);
router.delete('/deleteExpense/:id',expenseController.deleteExpense);
router.get('/get_expense',expenseController.getExpense);


module.exports = router;