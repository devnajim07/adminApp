const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const path = require('path');

// Define the Swagger specification
const swaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: 'Admin App API',
    version: '1.0.0',
    description: 'API documentation for the Admin App',
  },
  servers: [
    {
      url: 'http://localhost:5000/api',
      description: 'Development server',
    },
  ],
};

// Setup Swagger options
const options = {
  swaggerDefinition,
  apis: [path.join(__dirname, 'routes/*.js')], // Path to the API docs
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = {
  swaggerUi,
  swaggerSpec,
};
