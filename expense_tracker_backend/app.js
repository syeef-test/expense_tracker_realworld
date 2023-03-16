const express = require("express");
const sequelize = require("./util/database");
const bodyParser =require('body-parser');
const dotenv = require('dotenv');
dotenv.config();
const Expense = require('./models/expenseModel');
const User = require('./models/userModel');
const Order = require("./models/orderModel");
const forgotPassword = require("./models/forgotPasswordModel");

const userRoute = require("./routes/userRoute");
const expenseRoute = require("./routes/expenseRoute");
const purchaseRoute = require("./routes/purchaseRoute");
const premiuemRoute = require("./routes/premiuemRoute");
const passwordRoute = require("./routes/passwordRoute");

const app = express();

const cors = require("cors");


app.use(cors());

app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());

app.use('/user',userRoute);
app.use('/expense',expenseRoute);
app.use('/purchase',purchaseRoute);
app.use('/premiuem',premiuemRoute);
app.use('/password',passwordRoute);


User.hasMany(Expense);
Expense.belongsTo(User,{constraints:true,onDelete:'CASCADE'});

User.hasMany(Order);
Order.belongsTo(User);

User.hasMany(forgotPassword);
forgotPassword.belongsTo(User);



sequelize
  .sync()
  //.sync({force:true})
  .then((result) => {
    app.listen(3000);
  })
  .catch((err) => console.log(err));
