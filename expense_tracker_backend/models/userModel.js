const Sequelize = require('sequelize');

const sequelize = require('../util/database');

const Users = sequelize.define('users',{
    id:{
        type:Sequelize.INTEGER,
        autoIncrement:true,
        allowNull:false,
        primaryKey:true
    },
    name:{
        type:Sequelize.STRING,
        allowNull:false
    },
    email:{
        type:Sequelize.STRING,
        allowNull:false,
        unique:false
    },
    password:{
        type:Sequelize.STRING,
        allowNull:false
    },
    ispremiumuser:Sequelize.BOOLEAN,
    totalExpense:{
        type:Sequelize.DOUBLE,
        defaultValue: 0.00,
        allowNull:true
    }
});


module.exports = Users;