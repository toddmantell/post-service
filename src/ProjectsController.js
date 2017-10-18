const Router = require('express').Router();
const db = require('./dataStore/db');
const Project = require('./dataStore/ProjectSchema');
const {baseUrl} = require('./config');


Router.get('/', async (req, res) => {
  const allProjects = await getAllProjects();

  if (allProjects.length) return res.status(200).send(allProjects);
  return res.status(500).send("There was a problem retrieving projects.");
});

Router.post('/', async (req, res) => {
  const allProjects = await getAllProjects();

  const lastProject = allProjects[allProjects.length - 1];

  const newProject = Object.assign({}, req.body, {id: lastProject.id + 1});

  Project.create(newProject, (error, project) => {
    if (error) return res.status(500).send("There was an error when attempting to add the new project.");
    return res.status(201).json(newProject);
  });
});

Router.get('/:id', (req, res) => {
  const id = checkForValidId(req.params.id);

  Project.find({id}, (error, project) => {
    if (project.length) return res.status(200).send(project);
    return res.status(404).send("Project not found.");
    
  });
});

Router.put('/:id', (req, res) => {
  const id = checkForValidId(req.params.id);

  Project.findOne({id}, (error, project) => {
    if (error) return res.status(404).send("Project not found.");
    else if (project) { 
      updateProject(project, req, res);
    }
  });
});

async function getAllProjects() {  
  const allProjects = await Project.find({}, (error, projects) => {
    if (error) {
      console.log('error: ', error);
      throw error;
    } else {
      return projects;
    }
  });
  
  return allProjects;
}

function checkForValidId(id) {
  return parseInt(id) || 0;// checks to see if left side is truthy, if yes return it, otherwise return what is on the right
}

function updateProject(project, req, res) {
  Project.findByIdAndUpdate(project._id, req.body, {new: true}, (error, project) => {
    if (error) return res.status(500).send("Unable to update project.");
    res.status(200).send(project);
  });
}

module.exports = Router;