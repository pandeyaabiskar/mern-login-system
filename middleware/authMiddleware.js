const jwt = require('jsonwebtoken')

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

module.exports = { requireAuth };