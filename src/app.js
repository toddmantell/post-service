const app = require('express')();
const bodyParser = require('body-parser');
const ProjectsController = require('./ProjectsController');

configureBodyParser();

app.use((req, res, next) => {
  console.log(`Request for ${req.path} received from ${req.ip} at ${new Date()}`);  
  next();
});

app.get('/', (req, res, next) => {
  res.send('Service is up!');
});

app.use('/projects', ProjectsController);


function configureBodyParser() {
  app.use(bodyParser.urlencoded({extended: true}));
  app.use(bodyParser.json());//without this, application/json will not get processed https://stackoverflow.com/questions/38294730/express-js-post-req-body-empty
}

module.exports = app;