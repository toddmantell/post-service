const Router = require('express').Router();
const db = require('./dataStore/db');
const Post = require('./dataStore/PostSchema');
const {baseUrl} = require('./config');


Router.get('/', async (req, res) => {
  const allPosts = await getAllPosts();

  if (allPosts.length) return res.status(200).send(allPosts);
  return res.status(500).send("There was a problem retrieving posts.");
});

Router.post('/', async (req, res) => {
  const allPosts = await getAllPosts();

  const lastPost = allPosts[allPosts.length - 1];

  const newPost = Object.assign({}, req.body, {id: lastPost.id + 1});

  Post.create(newPost, (error, post) => {
    if (error) return res.status(500).send("There was an error when attempting to add the new post.");
    return res.status(201).json(newPost);
  });
});

Router.get('/:id', (req, res) => {
  const id = checkForValidId(req.params.id);

  Post.find({id}, (error, post) => {
		if (post.length) return res.status(200).send(post);
		
    return res.status(404).send("Post not found.");
  });
});

Router.put('/:id', (req, res) => {
  const id = checkForValidId(req.params.id);

  Post.findOne({id}, (error, post) => {
    if (error) return res.status(404).send("Post not found.");
    else if (post) { 
      updatePost(post, req, res);
    }
  });
});

async function getAllPosts() {  
  const allPosts = await Post.find({}, (error, posts) => {
    if (error) {
      console.log('error: ', error);
      throw error;
    } else {
      return posts;
    }
  });
  
  return allPosts;
}

function checkForValidId(id) {
  return parseInt(id) || 0;// checks to see if left side is truthy, if yes return it, otherwise return what is on the right
}

function updatePost(post, req, res) {
  Post.findByIdAndUpdate(post._id, req.body, {new: true}, (error, post) => {
    if (error) return res.status(500).send("Unable to update post.");
    res.status(200).send(post);
  });
}

module.exports = Router;