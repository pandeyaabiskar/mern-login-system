const User = require("../models/User");

const returnSignupPage = (req, res) => {
  res.render("signup");
};

const returnLoginPage = (req, res) => {
  res.render("login");
};

const createUser = async (req, res) => {
  //Code
  try {
    const user = new User(req.body);
    console.log(user)
    await user.save();
    res.json({ userid: user._id });
  } catch (err) {
    console.log(err);
    res.json(err);
  }
};

const loginUser = (req, res) => {
  //Code
};

module.exports = {
  returnSignupPage,
  returnLoginPage,
  createUser,
  loginUser,
};
