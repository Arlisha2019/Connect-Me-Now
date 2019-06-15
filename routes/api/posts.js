const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator/check');
const auth = require('../../middleware/auth')
const User = require('../../models/User');
const Post = require('../../models/Post');
const Profile = require('../../models/Profile');


//@route Get api/posts
//@access Private
//@desc Get All Posts

router.get('/', auth, async (req, res) => {


  const posts = await Post.find().sort({ date: -1 })

  res.json(posts);

  try {

  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error Posts')
  }
  });

  //@route Get api/posts/:id
  //@access Private
  //@desc Get post by ID

  router.get('/:id', auth, async (req, res) => {

    const post = await Post.findById(req.params.id)

    if(!post) {
      return res.status(404).json({ msg: 'Post not found'});
    }
    res.json(post);

    try {

    } catch (err) {
      console.error(err.message);

      if(err.kind === 'ObjectId') {
        return res.status(404).json({ msg: 'Post not found'});
    }
      res.status(500).send('Server Error Posts')
  }
});

//@route Post api/posts
//@access Private
//@desc Create Post

router.post('/', [auth,
  [
    check('text', 'Text is required')
      .not()
      .isEmpty()
  ]
], async (req, res) => {

  const errors = validationResult(req);

  if(!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {

    const user = await User.findById(req.user.id).select('-password');

    const newPost = new Post({
      text: req.body.text,
      name: user.name,
      avatar: user.avatar,
      user: req.user.id
    });

    const post = await newPost.save();

    res.json(post);

  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error')
  }
})

//@route DELETE api/posts/:id
//@access Private
//@desc Delete a Post

router.delete('/:id', auth, async (req, res) => {
  try {

    const post = await Post.findById( req.params.id );

    if(!post) {
      return res.status(404).json({ msg: 'Post not found'});
    }

    //check on user
    if(post.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'User not authorized'})
    }

    await post.remove();

    res.json({ msg: 'Post Removed' });

  } catch(err) {

    console.error(err.message);

    if(err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Post not found'});
  }
    res.status(500).send('Server Error');
  }
});

//@route PUT api/like/:id
//@access Private
//@desc Like a post

router.put('/like/:id', auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    //check if the post has already been liked

    if(post.likes.filter(like => like.user.toString() === req.user.id).length > 0) {
      return res.status(400).json({ msg: 'Post already liked'})
    }
    post.likes.unshift({ user: req.user.id });

    await post.save();

    res.json(post.likes);

  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error')
  }
});

//@route PUT api/posts/unlike/:id
//@access Private
//@desc Like a post

router.put('/unlike/:id', auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    //check if the post has already been liked

    if(post.likes.filter(like => like.user.toString() === req.user.id).length === 0) {
      return res.status(400).json({ msg: 'Post has not been liked yet '})
    }
    //Get remove index

    const removeIndex = post.likes.map(like => like.user.toString()).indexOf(req.user.id);

    post.likes.splice(removeIndex, 1)

    await post.save();

    res.json(post.likes);

  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error')
  }
});

//@route Post api/posts/comments/:id
//@access Private
//@desc Create Comments on a Post

router.post('/comment/:id', [auth,
  [
    check('text', 'Text is required')
      .not()
      .isEmpty()
  ]
], async (req, res) => {

  const errors = validationResult(req);

  if(!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {

    const user = await User.findById(req.user.id).select('-password');

    const post = await Post.findById(req.params.id);

    const newComment = {
      text: req.body.text,
      name: user.name,
      avatar: user.avatar,
      user: req.user.id
    };

    post.comments.unshift(newComment);

    await post.save();

    res.json(post.comments);

  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error')
  }
});

//@route Post api/posts/comments/:post_id/:comment_id
//@access Private
//@desc Delete Comment

router.delete('/comment/:post_id/:comment_id', auth, async (req, res) => {
  try {

    const post = await Post.findById(req.params.post_id);

    //pull out comment

    const comment = post.comments.find(comm => comm.id === req.params.comment_id);

    //make sure comment Exists
    if(!comment) {
      return res.status(404).json({ msg: 'Comment does not exist'});
    }

    //Check user
    if(comment.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'User not authorized'});
    }

    const removeIndex = post.comments.map(comment => comment.user.toString()).indexOf(req.user.id);

    post.comments.splice(removeIndex, 1)

    await post.save();

   res.json({ msg: 'Comment Removed'});

  } catch (err) {
    console.error(err.message);
    res.status(500).send({ msg: 'Sever Error'})
  }
})



module.exports = router;
