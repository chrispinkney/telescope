const { logger } = require('@senecacdot/satellite');
const service = require('.');

const PORT = parseInt(process.env.USER_PORT || 6666, 10);

service.start(PORT, () => {
  logger.info(`User microservice started on port ${PORT}`);
});

module.exports = service;
