// Elysia - Native Bun framework (claims fastest)
import { Elysia } from 'elysia';

const port = parseInt(process.env.PORT || '3008');

const app = new Elysia()
  // Simple route
  .get('/', () => 'Hello World')

  // JSON response
  .get('/json', () => ({ message: 'Hello World', timestamp: Date.now() }))

  // Route with params
  .get('/user/:id', ({ params }) => ({ id: params.id, name: `User ${params.id}` }))

  // Route with middleware (using derive for state)
  .get('/middleware', ({ store }) => ({
    processed: true,
    duration: Date.now() - (store as any).startTime
  }), {
    beforeHandle: ({ store }) => {
      (store as any).startTime = Date.now();
    }
  })

  // POST with body parsing
  .post('/echo', ({ body }) => ({ received: body }))

  .listen(port);

console.log(`Elysia server running on port ${port}`);

process.on('SIGINT', () => {
  console.log('Shutting down Elysia server...');
  process.exit(0);
});

export default app;
