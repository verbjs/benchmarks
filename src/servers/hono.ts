import { Hono } from 'hono';
import { serve } from '@hono/node-server';

const port = parseInt(process.env.PORT || '3004');

const app = new Hono();

// Simple route
app.get('/', (c) => {
  return c.text('Hello World');
});

// JSON response
app.get('/json', (c) => {
  return c.json({ message: 'Hello World', timestamp: Date.now() });
});

// Route with params
app.get('/user/:id', (c) => {
  const id = c.req.param('id');
  return c.json({ id, name: `User ${id}` });
});

// Route with middleware
app.use('/middleware', async (c, next) => {
  c.set('startTime', Date.now());
  c.set('processed', true);
  await next();
});

app.get('/middleware', (c) => {
  return c.json({ 
    processed: c.get('processed'), 
    duration: Date.now() - c.get('startTime') 
  });
});

// POST with body parsing
app.post('/echo', async (c) => {
  const body = await c.req.json();
  return c.json({ received: body });
});

const server = serve({
  fetch: app.fetch,
  port
});

console.log(`Hono server running on port ${port}`);

process.on('SIGINT', () => {
  console.log('Shutting down Hono server...');
  process.exit(0);
});

export default server;