const app = require('express')();
const bodyParser = require('body-parser');
const db = require('./dataStore/db');
const Project = require('./dataStore/ProjectSchema');

app.use(bodyParser.urlencoded({extended: true}));
app.use((req, res, next) => {
  console.log(`Request for ${req.path} received from ${req.ip} at ${new Date()}`);
  next();
});

app.get('/', (req, res, next) => {
  res.send('Service is up!');
});

app.get('/projects', (req, res) => {
  Project.find({}, (error, projects) => {
    if (error) return res.status(500).send("There was a problem finding projects");
    return res.status(200).send(projects);
  });
});

app.post('/projects/', (req, res) => {
  const newProject = req.body;

  console.log(newProject);
  res.status(201).send('ok');
  //projects.push({})// Would be nice to not push.  Also need the request body, not the id
});

app.get('/projects/:id', (req, res) => {
  const id = checkForValidId(req.params.id);

  Project.find({id}, (error, project) => {
    if (error) return res.status(500).send("Unable to retrieve project");
    return res.status(200).send(project);
  });
});

// app.put('', (req, res) => {
//   // in here, need to either get the existing, or just overwrite based on the id passed in
// });

// app.post('/projects/', (req, res) => {
//   const id = checkForValidId(req.params.id);

//   projects.push({})// Would be nice to not push.  Also need the request body, not the id
// });

function checkForValidId(id) {
  return parseInt(id) || 0;// checks to see if left side is truthy, if yes return it, otherwise return what is on the right
}

function sendProjectOrError(chosenProject, res) {
  if (chosenProject) {
    res.json(chosenProject);
  } else {
    res.send('Unable to retrieve a project. Please supply a valid id.');
  } 
}

module.exports = app;