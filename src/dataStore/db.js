const mongoose = require('mongoose');

mongoose.connect('mongodb://a-mantell:whatwhatyo@ds127842.mlab.com:27842/apitest',
  {useMongoClient: true}
);