const express = require("express");
const sequelize = require("./util/database");
const bodyParser =require('body-parser');

const Expense = require('./models/expenseModel');
const User = require('./models/userModel');
const Order = require("./models/orderModel");

const userRoute = require("./routes/userRoute");
const expenseRoute = require("./routes/expenseRoute");
const purchaseRoute = require("./routes/purchaseRoute");

const app = express();

const cors = require("cors");

app.use(cors());

app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());

app.use('/user',userRoute);
app.use('/expense',expenseRoute);
app.use('/purchase',purchaseRoute);


User.hasMany(Expense);
Expense.belongsTo(User,{constraints:true,onDelete:'CASCADE'});

User.hasMany(Order);
Order.belongsTo(User);



sequelize
  .sync()
  //.sync({force:true})
  .then((result) => {
    app.listen(3000);
  })
  .catch((err) => console.log(err));
