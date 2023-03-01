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
      res.status(401).json({ message: "User Allready Exist with same email" });
    } else {
      const insertData = await User.create({
        name: name,
        email: email,
        password: password,
      });

      if (insertData) {
        data = insertData.toJSON();
        //console.log(data);
        res.status(201).json({ message: "Sign Up Succesful", data: data });
      } else {
        res.status(401).json({ message: "Sign Up unsuccesful" });
      }
    }
  } catch (error) {
    console.log(error);
  }
};
