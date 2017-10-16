const app = require('express')();
const bodyParser = require('body-parser');
const db = require('./dataStore/db');
const Project = require('./dataStore/ProjectSchema');
const {baseUrl} = require('./config');

configureBodyParser();

app.use((req, res, next) => {
  console.log(`Request for ${req.path} received from ${req.ip} at ${new Date()}`);  
  next();
});

app.get('/', (req, res, next) => {
  res.send('Service is up!');
});

app.get('/projects', async (req, res) => {
  const allProjects = await getAllProjects();

  if (allProjects.length) return res.status(200).send(allProjects);
  return res.status(500).send("There was a problem retrieving projects.");
});

app.post('/projects/', async (req, res) => {
  const allProjects = await getAllProjects();

  const lastProject = allProjects[allProjects.length - 1];

  const newProject = Object.assign({}, req.body, {id: lastProject.id + 1});

  Project.create(newProject, (error, project) => {
    if (error) return res.status(500).send("There was an error when attempting to add the new project.");
    return res.status(201).send(`${baseUrl}/projects/${newProject.id}`);
  });
});

app.get('/projects/:id', (req, res) => {
  const id = checkForValidId(req.params.id);

  Project.find({id}, (error, project) => {
    if (error) return res.status(404).send("Project not found.");
    return res.status(200).send(project);
  });
});

app.put('/projects/:id', (req, res) => {
  const id = checkForValidId(req.params.id);

  Project.findOne({id}, (error, project) => {
    if (error) return res.status(404).send("Project not found.");
    else if (project) { 
      updateProject(project, req, res);
    }
  });
});


function configureBodyParser() {
  app.use(bodyParser.urlencoded({extended: true}));
  app.use(bodyParser.json());//without this, application/json will not get processed https://stackoverflow.com/questions/38294730/express-js-post-req-body-empty
}

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

module.exports = app;