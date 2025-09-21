const path = require('path');
const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'DAT Backend APIs',
      version: '1.0.0',
      description: 'Distance Aand Time Management API',
    },
    servers: [
      {
        url: `/api/v1`,
      },
    ],
    components: {
      securitySchemes: {
        BearerAuth: {
          type: 'http',
          scheme: 'bearer',
        },
      },
    },
  },
  apis: [path.join(__dirname, './routes/v1/*.route.js')],
};

const swaggerSpecs = swaggerJsdoc(options);
module.exports = swaggerSpecs;
