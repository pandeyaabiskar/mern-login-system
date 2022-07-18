const User = require("../models/User");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const handleErrors = (err) => {
  console.log(err._message);
  const errors = {email: '', password: ''}

  if(err.message === 'incorrect email'){
    errors.email = "Email is incorrect"
  }

  if(err.message === 'incorrect password'){
    errors.password = "Password is incorrect"
  }

  if(err.code === 11000){
    errors.email = "Email already exists"
    return errors;
  }

  if(err._message === 'User validation failed'){
    Object.values(err.errors).map(({properties}) => {
      errors[properties.path] = properties.message
    })
  }
  console.log(errors)
  return errors;
}

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
    const errors = handleErrors(err);
    res.json({errors});
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
      }else{
        throw new Error('incorrect password')
      }
    }else{
      throw new Error('incorrect email')
    }
  } catch (err) {
    const errors = handleErrors(err);
    res.json({errors});
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
