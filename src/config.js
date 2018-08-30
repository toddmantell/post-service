module.exports = {
  port: process.env.port || 8080,
  baseUrl: `http://localhost:${this.port}`
};