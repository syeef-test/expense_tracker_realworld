const express = require("express");
const sequelize = require("./util/database");
const bodyParser =require('body-parser');

const Expense = require('./models/expenseModel');
const User = require('./models/userModel');

const userRoute = require("./routes/userRoute");
const expenseRoute = require("./routes/expenseRoute");

const app = express();

const cors = require("cors");
app.use(cors());

app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());

app.use('/user',userRoute);
app.use('/expense',expenseRoute);


User.hasMany(Expense);
Expense.belongsTo(User,{constraints:true,onDelete:'CASCADE'});



sequelize
  .sync()
  //.sync({force:true})
  .then((result) => {
    app.listen(3000);
  })
  .catch((err) => console.log(err));
