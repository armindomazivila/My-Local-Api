import swaggerJSDoc from 'swagger-jsdoc';

export const swaggerSpec = swaggerJSDoc({
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'My Local API',
      version: '1.0.0',
      description: 'Local API with users, persisted in SQLite'
    },
    servers: [{ url: 'http://localhost:3000', description: 'Local server' }],
    components: {
      schemas: {
        User: {
          type: 'object',
          properties: {
            id: { type: 'integer', example: 1 },
            name: { type: 'string', example: 'Arminndo Mazivila' },
            email: { type: 'string', example: 'armindo.mazivila1990@gmail.com' },
          },
        },
      },
    },
  },
  apis: ['./src/routes/*.ts'],
});
