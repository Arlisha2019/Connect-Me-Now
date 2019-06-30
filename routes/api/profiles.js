const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth')
const { check, validationResult} = require('express-validator/check');
const Profile = require('../../models/Profile')
const User = require('../../models/User');
const Post = require('../../models/Post');


//@route Get api/profile/me
//@access Public
//@desc Get Current Users Profile
router.get('/me',auth, async(req, res) => {

  try {
    const profile = await Profile.findOne({
      user: req.user.id
    }).populate('user',
    ['name', 'avatar']);
    // console.log(profile);

    if(!profile) {
      return res.status(400).json({ msg: 'There is no profile for this user' });
    }
    res.json(profile);

  } catch(err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

router.post('/', [ auth,
 check('status', 'Status is Required')
  .not()
  .isEmpty(),
 check('skills', 'Skills is Required')
  .not()
  .isEmpty()
],
 async (req, res) => {

   const errors = validationResult(req);
   if(!errors.isEmpty()) {
     return res.status(400).json({ errors: errors.array()
     })
   }

   const {
     company,
     website,
     location,
     bio,
     status,
     githubusername,
     skills,
     youtube,
     facebook,
     twitter,
     instagram,
     linkedin
   } = req.body;

   //Build Profile object

   const profileFields = {};

   profileFields.user = req.user.id;

   if(company) profileFields.company = company;
   if(website) profileFields.website = website;
   if(location) profileFields.location = location;
   if(bio) profileFields.bio = bio;
   if(status) profileFields.status = status;
   if(githubusername) profileFields.githubusername = githubusername;
   if(skills) {
     profileFields.skills = skills.split(',').map(skill => skill.trim())
    }

  //Build social Object

  profileFields.social = {};

  if(youtube) profileFields.social.youtube = youtube;
  if(twitter) profileFields.social.twitter = twitter;
  if(facebook) profileFields.social.facebook = facebook;
  if(linkedin) profileFields.social.linkedin = linkedin;
  if(instagram) profileFields.social.instagram = instagram;

  // console.log(profileFields.social.twitter);
  //
  // console.log(profileFields.skills);

  try {
    let profile = await Profile.findOne({ user: req.user.id
    });

    if(profile) {
      //Update
      profile = await Profile.findOneAndUpdate(
      { user: req.user.id },
      { $set: profileFields },
      { new: true}
      );

      return res.json(profile);
    }
    //Create
    profile = new Profile(profileFields);

    await profile.save();
    console.log(profile);
    res.json(profile);

  } catch(err) {
    console.error(err.message);
    res.status(500).send('Server Error')
    }
  }
);

//@route Get api/profile
//@access Public
//@desc Get all Profiles

router.get('/', async (req, res) => {
  try {

    const profiles = await Profile.find().populate('user', ['name', 'avatar']);

    res.json(profiles);
  } catch(err) {
    console.error(err.message);
    res.status(500).send('Server Error GET ALL PROFILE')
  }
})

//@route Get api/profile/user/:user_id
//@access Public
//@desc Get profile by user ID

router.get('/user/:user_id', async (req, res) => {
  try {

    const profile = await Profile.findOne({ user: req.params.user_id}).populate('user', ['name', 'avatar']);

    if(!profile) return res.status(400).json({ msg: 'No Profile on record' })

    res.json(profile);

  } catch(err) {
    console.error(err.message);
    if(err.kind == 'ObjectId') {
      return res.status(400).json({ msg: 'Profile not found ' })
    }
    res.status(500).send('Server Error GET ALL PROFILE')
  }
})

//@route DELETE api/profile
//@access Private
//@desc Delete profile, user & posts

router.delete('/', auth, async (req, res) => {
  try {
    //remove users posts
    await Post.deleteMany({ user: req.user.id})
    //Remove profile
    await Profile.findOneAndRemove({ user: req.user.id });
    //Remove user
    await User.findOneAndRemove({ _id: req.user.id });
    res.json({msg: 'User Removed'});

  } catch(err) {
    console.error(err.message);
    res.status(500).send('Server Error')
  }
});

//@route PUT api/profile/experience
//@access Private
//@desc Add Profile Experience

router.put('/experience', [
  auth,
  [
    check('title', 'Title is required')
      .not()
      .isEmpty(),
    check('company', 'Company is required')
      .not()
      .isEmpty(),
    check('from', 'From date is required')
      .not()
      .isEmpty(),
  ]
], async (req, res) => {
    const errors = validationResult(req);

    if(!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const {
      title,
      company,
      location,
      from,
      to,
      current,
      description
    } = req.body;

    const newExp = {
      title,
      company,
      location,
      from,
      to,
      current,
      description
    }

    try {

      const profile = await Profile.findOne({ user: req.user.id });

      profile.experience.unshift(newExp);

      await profile.save();

      console.log(profile);

      res.json(profile);

    } catch(err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
});

//@route DELETE api/profile/experience/:exp_id
//@access Private
//@desc Delete Profile Experience

router.delete('/experience/:exp_id', auth, async (req, res) => {
  try {

    const profile = await Profile.findOne({ user: req.user.id });

    //Get remove index

    const removeIndex = profile.experience.map(item => item.id).indexOf(req.params.exp_id);

    profile.experience.splice(removeIndex, 1);

    await profile.save();

    res.json(profile);

  } catch (err) {
    console.error(err.message);
  }
});

//@route PUT api/profile/education
//@access Private
//@desc Add Profile Education

router.put('/education', [
  auth,
  [
    check('school', 'School is required')
      .not()
      .isEmpty(),
    check('degree', 'Degree is required')
      .not()
      .isEmpty(),
    check('fieldofstudy', 'Field of study is required')
      .not()
      .isEmpty(),
    check('from', 'From date is required')
      .not()
      .isEmpty(),
  ]
], async (req, res) => {
    const errors = validationResult(req);

    if(!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const {
      school,
      degree,
      fieldofstudy,
      from,
      to,
      current,
      description
    } = req.body;

    const newEdu = {
      school,
      degree,
      fieldofstudy,
      from,
      to,
      current,
      description
    }

    try {

      const profile = await Profile.findOne({ user: req.user.id });

      profile.education.unshift(newEdu);

      await profile.save();

      console.log(profile);

      res.json(profile);

    } catch(err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
});

//@route DELETE api/profile/education/:edu_id
//@access Private
//@desc Delete Profile Education

router.delete('/education/:edu_id', auth, async (req, res) => {
  try {

    const profile = await Profile.findOne({ user: req.user.id });

    //Get remove index

    const removeIndex = profile.education.map(item => item.id).indexOf(req.params.edu_id);

    profile.education.splice(removeIndex, 1);

    await profile.save();

    res.json(profile);

  } catch (err) {
    console.error(err.message);
  }
});




module.exports = router;
