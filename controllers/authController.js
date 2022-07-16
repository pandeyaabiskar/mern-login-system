const User = require("../models/User");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

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
    console.log(user);
    await user.save();
    //Create Token
    const token = jwt.sign({ id: user._id }, "MERN_STACK", {
      expiresIn: "1d",
    });
    res.cookie("jwt", token);
    res.json({ user: user._id });
  } catch (err) {
    console.log(err);
    res.json(err);
  }
};

const loginUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (user) {
      const match = await bcrypt.compare(password, user.password);
      if (match) {
        //Create Token
        const token = jwt.sign({ id: user._id }, "MERN_STACK", {
          expiresIn: "1d",
        });
        res.cookie("jwt", token);
        res.json({ user: user._id });
        return;
      }
    }
    res.json({ msg: "Cannot authenticate" });
  } catch (err) {
    res.json(err);
  }
};

const logoutUser = (req, res) => {
  res.cookie('jwt', '', {
    maxAge: '1'
  })
  res.redirect('/');
}

module.exports = {
  returnSignupPage,
  returnLoginPage,
  createUser,
  loginUser,
  logoutUser
};
