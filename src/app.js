const app = require('express')();
const bodyParser = require('body-parser');
const db = require('./dataStore/db');
const Project = require('./dataStore/ProjectSchema');

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());//without this, application/json will not get processed https://stackoverflow.com/questions/38294730/express-js-post-req-body-empty
app.use((req, res, next) => {
  console.log(`Request for ${req.path} received from ${req.ip} at ${new Date()}`);
  console.log('body', req.body);  
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
});

app.get('/projects/:id', (req, res) => {
  const id = checkForValidId(req.params.id);

  Project.find({id}, (error, project) => {
    if (error) return res.status(500).send("Unable to retrieve project.");
    return res.status(200).send(project);
  });
});

app.put('/projects/:id', (req, res) => {
  const id = checkForValidId(req.params.id);

  Project.findOne({id}, (error, project) => {
    if (error) return res.status(500).send("Unable to update project.");
    else if (project) { 
      updateProject(project, req, res);
    }
  });
});

app.post('/projects/', (req, res) => {
  const id = checkForValidId(req.params.id);

  projects.push({})// Would be nice to not push.  Also need the request body, not the id
});

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