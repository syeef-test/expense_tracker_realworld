const express = require("express");
const sequelize = require("./util/database");
const bodyParser =require('body-parser');


const userRoute = require("./routes/userRoute");

const app = express();

const cors = require("cors");
app.use(cors());

app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());

app.use('/user',userRoute);

sequelize
  .sync()
  //.sync({force:true})
  .then((result) => {
    app.listen(3000);
  })
  .catch((err) => console.log(err));
