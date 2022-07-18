const jwt = require('jsonwebtoken')
const User = require('../models/User')

const requireAuth =  (req, res, next) => {
  //Code
  const {jwt:token} = req.cookies;
  if(token){
    const isValid = jwt.verify(token, 'MERN_STACK');
    if(isValid){
      next();
    }
  } else {
    res.redirect('/login')
  }

};

const checkUser = (req, res, next) => {
  const {jwt:token} = req.cookies;

  if(token){
    jwt.verify(token, 'MERN_STACK', async (err, decodedToken) => {
      if(err){
        res.locals.user = null;
        next();
      }else{
        const user = await User.findById(decodedToken.id);
        res.locals.user = user;
        next();
      }
    })
  }else{
    res.locals.user = null;
    next();
  }
}

module.exports = { requireAuth, checkUser };