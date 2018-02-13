const mongoose = require('mongoose');

const PostSchema = new mongoose.Schema({
  id: Number,
  title: String,
	body: String,
	author: String
});

mongoose.model('Post', PostSchema);
module.exports = mongoose.model('Post');