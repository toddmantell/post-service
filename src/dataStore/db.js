const mongoose = require('mongoose');

mongoose.Promise = global.Promise;//Set mongoose to use native JS Promises

mongoose.connect('mongodb://a-mantell:whatwhatyo@ds127842.mlab.com:27842/apitest',
  {useMongoClient: true}
);