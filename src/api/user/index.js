const { Satellite } = require('@senecacdot/satellite');

const service = new Satellite();
const user = require('./src/routes/user');

service.router.use('/', user);

module.exports = service;
