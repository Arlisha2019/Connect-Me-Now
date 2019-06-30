const jwt = require('jsonwebtoken');

const config = require('config');

module.exports = function( req, res, next ) {
  //Get Token from Header

  const token = req.header('tokenz');

  // Check if no Token

  if(!token) {
    return res.status(401).json({ msg: 'No token, authorization denied'});
    console.log(token);
  }
  //Verify the token

  try {
    const decoded = jwt.verify(token, config.get('jwtSecret'));

    req.user = decoded.user;
    next();

    } catch(err) {
      res.status(401).json({ msg: 'Token is not valid'});
  }
}
