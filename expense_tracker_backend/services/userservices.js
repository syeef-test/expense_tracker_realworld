const getExpenses = (req,where) =>{
    return req.user.getExpenses({attributes: ['expenseamount', 'description','category','createdAt']},{where});
}

module.exports = {
    getExpenses
}