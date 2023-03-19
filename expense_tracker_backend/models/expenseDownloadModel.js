const Sequelize = require('sequelize');

const sequelize = require('../util/database');

const ExpenseDownload = sequelize.define('expensedownload',{
    expenseurl:{
        type:Sequelize.STRING,
        allowNull:false
    },
});


module.exports = ExpenseDownload;