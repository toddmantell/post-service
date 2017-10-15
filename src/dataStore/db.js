const mongoose = require('mongoose');

mongoose.connect('mongodb://someconnectionstring/api',
  {useMongoClient: true}
);