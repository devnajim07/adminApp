const express = require('express');
const YAML = require('yamljs');
const path = require('path');
const bodyParser = require('body-parser');
const userRoutes = require('./routes/router');
const { swaggerUi} = require('./swagger');

const logger = require('./logger');

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(bodyParser.json());

// Load Swagger YAML
const swaggerDocument = YAML.load(path.join(__dirname, './api/swagger.yaml'));

// Setup Swagger UI
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

(async () => {
  try {
    app.use('/api/v1/', userRoutes());
    app.listen(port, () => logger.debug(`Server running on port ${port}`));
  } catch (error) {
    logger.error('Failed to start the server:', error);
  }
})();
