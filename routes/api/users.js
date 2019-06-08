const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator/check');
const gravatar = require('gravatar');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const config = require('config');

const User = require('../../models/User');

//@route Get api/users
//@access Public
//@desc Test Route
router.get('/', (req, res) =>
  res.send('User Route'));

router.post('/', [
  check('name', 'Name is required')
    .not()
    .isEmpty(),
  check('email', 'Please include a valid email')
    .isEmail(),
  check('password', 'Please enter a password with 6 or more charaters')
    .isLength({ min: 6})
],
async (req, res) => {

  const errors = validationResult(req);

  if(!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

 const { name, email, password } = req.body;

 try {
   //See if User Exists
   let user = await User.findOne({ email });

   if(user) {
     return res
       .status(400)
       .json({ errors: [{ msg: 'User already exists'}] });
   }
   //Get User gravatar
   const avatar = gravatar.url(email, {
     s: '200',
     r: 'pg',
     d: 'mm'
   });

   user = new User({
     name,
     email,
     avatar,
     password
   })
   // Encrypt password
   const salt  = await bcrypt.genSalt(10);

   user.password = await bcrypt.hash(password, salt);

   await user.save()
   //Return jsonwebtoken

   const payload = {
     user: {
       id: user.id
     }
   }
   jwt.sign(
     payload,
     config.get('jwtSecret'),
     { expiresIn: 36000},
     (err, token) => {
       if(err) throw err;
       res.json({ token })
     });
   // res.send('User registered')

 } catch (err) {
   console.error(err.message);
   res.status(500).send('Server Error');
 }

});


module.exports = router;
