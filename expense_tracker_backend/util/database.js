require('dotenv').config();


const Sequelize = require('sequelize');

const sequelize = new Sequelize(process.env.DATABASE_NAME,process.env.DATABASE_USER,process.env.DATABASE_PASSWORD,{dialect:process.env.DATABASE_TYPE,host:process.env.DATABASE_HOST});

module.exports = sequelize;