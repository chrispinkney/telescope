const { logger } = require('@senecacdot/satellite');
const path = require('path');
const service = require('.');
require('dotenv').config({ path: path.join(__dirname, '../env.development') });

const PORT = parseInt(process.env.USER_PORT || 6666, 10);

service.start(PORT, () => {
  logger.info(`User microservice started on port ${PORT}`);
});

module.exports = service;
