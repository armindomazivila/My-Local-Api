import swaggerJSDoc from 'swagger-jsdoc';

export const swaggerSpec = swaggerJSDoc({
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'My Local API',
      version: '1.0.0',
      description: 'Local API with users, persisted in SQLite'
    },
    servers: [
      { url: 'http://localhost:3000', description: 'Local server' }
    ]
  },
  apis: [] // We return a minimal spec directly; for large projects consider using JSDoc comments and pointing to files here
});

// You can extend swaggerSpec.paths here or generate it with annotations.
// For brevity we show docs via swagger-ui; the endpoints are simple and documented in README and tests.