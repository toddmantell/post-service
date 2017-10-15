const server = require('./app');
const {port} = require('./config');

server.listen(port, () => {
  console.log(`listening on port: ${port}`);
});