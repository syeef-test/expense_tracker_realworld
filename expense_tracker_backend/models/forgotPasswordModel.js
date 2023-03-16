const Sequelize = require('sequelize');

const sequelize = require('../util/database');

const ForgotPassword = sequelize.define('forgotpasswordrequests',{
    id:{
        type:Sequelize.UUID,
        allowNull:false,
        primaryKey:true
    },
    isactive:{
        type:Sequelize.BOOLEAN,
        allowNull:false,
        defaultValue: true
    }  
});


module.exports = ForgotPassword;