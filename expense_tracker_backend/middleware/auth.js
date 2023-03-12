const jwt = require("jsonwebtoken");

const User = require("../models/userModel");

const authenticate = (req, res, next) => {
  try {
    const token = req.header("authorization");
    //console.log("auth:",token);
    const user = jwt.verify(token, process.env.TOKEN_SECRET);
    //console.log(user.userId);
    User.findByPk(user.userId)
      .then((user) => {
        //console.log("found user in auth",JSON.stringify(user));
        req.user = user;
        next();
      })
      .catch((err) => {
        throw new Error(err);
      });
  } catch (error) {
    return res.status(401).json({ success: false });
  }
};

module.exports = {
  authenticate,
};
