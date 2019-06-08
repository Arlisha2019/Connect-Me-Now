const express = require('express');
const router = express.Router();

//@route Get api/users
//@access Public
//@desc Test Route
router.get('/', (req, res) =>
  res.send('Post Route'));


module.exports = router;
