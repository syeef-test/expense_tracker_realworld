const User = require("../models/userModel");

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');


exports.postSignup = async (req, res, next) => {
  try {
    //console.log(req.body);
    const name = req.body.name;
    const email = req.body.email;
    const password = req.body.password;

    const user = await User.findAll({
      attributes: ["email"],
      where: { email: req.body.email },
    });

    if (typeof user !== "undefined" && user.length > 0) {
      res.status(401).json({ message: "User Allready Exist with same email",success:false});
    } else {

      const saltrounds = 10;
      bcrypt.hash(password, saltrounds, async (err, hash) => {
        const insertData = await User.create({ name, email, password: hash });
        res.status(201).json({ message: "Sign Up Succesful",success:true});
      });
      
    }
  } catch (error) {
    console.log(error.toJSON());
  }
};

exports.generateAccessToken = (id, name, ispremiuemuser) => {
  //console.log(id,name,ispremiuemuser);
  return jwt.sign({ userId: id, name: name, ispremiuemuser: ispremiuemuser }, process.env.TOKEN_SECRET);
};

exports.postLogin = async (req, res, next) => {
  try {
    const email = req.body.email;
    const password = req.body.password;


    const user = await User.findAll({
      attributes: ["email", "password", "id", "ispremiumuser", "name"],
      where: { email: req.body.email },
    });

    if (typeof user !== "undefined" && user.length > 0) {

      //console.log(user[0].password);
      //used bycryptjs insted of bycrypt as bycrypt is not instaling
      const match = await bcrypt.compareSync(req.body.password, user[0].password);
      //console.log(match);
      if (match) {
        //console.log(user[0]);
        //console.log(generateAccessToken(user[0].id,user[0].name,user[0].ispremiumuser));
        res.status(200).json({ message: "User Login Succesful", token: this.generateAccessToken(user[0].id, user[0].name, user[0].ispremiumuser),success:true});
      } else {
        res.status(401).json({ message: "User Not authorized",success:false});
      }

    }
    else {
      res.status(404).json({ message: "User Does not exist",success:false});
    }
  }
  catch (err) {
    console.log(err);
  }

};





