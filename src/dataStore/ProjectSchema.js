const mongoose = require('mongoose');

const ProjectSchema = new mongoose.Schema({
  id: Number,
  name: String,
  team: {
    name: String,
    lead: String,
    qa: [String],
    developers: [String]
  }
});

mongoose.model('Project', ProjectSchema);
module.exports = mongoose.model('Project');