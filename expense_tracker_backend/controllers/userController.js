const User = require("../models/userModel");

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
      res.status(401).json({ error: "User Allready Exist with same email" });
    } else {
      const insertData = await User.create({
        name: name,
        email: email,
        password: password,
      });

      if (insertData) {
        data = insertData.toJSON();
        console.log(data);
        res.status(201).json({ message: "Sign Up Succesful", data: data });
      } else {
        res.status(401).json({ error: "Sign Up unsuccesful" });
      }
    }
  } catch (error) {
    console.log(error.toJSON());
  }
};


exports.postLogin = async (req, res, next) => {
  try {
    const email = req.body.email;
    const password = req.body.password;


    const user = await User.findAll({
      attributes: ["email"],
      where: { email: req.body.email },
    });

    if (typeof user !== "undefined" && user.length > 0) {

      const checkEmailPwd = await User.findAll({
        attributes: ['email', 'password'],
        where: { email: email, password: password }
      });

      if (typeof checkEmailPwd !== "undefined" && checkEmailPwd.length > 0) {
        res.status(200).json({ message: "User Login Succesful" });
      } else {
        res.status(401).json({ error: "User Not authorized" });
      }
    }
    else {
      res.status(404).json({ error: "User Does not exist" });
    }
  }
  catch (err) {
    console.log(err);
  }

};
