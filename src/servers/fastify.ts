import Fastify from 'fastify';

const port = parseInt(process.env.PORT || '3003');

const fastify = Fastify({ logger: false });

// Simple route
fastify.get('/', async (request, reply) => {
  return 'Hello World';
});

// JSON response
fastify.get('/json', async (request, reply) => {
  return { message: 'Hello World', timestamp: Date.now() };
});

// Route with params
fastify.get('/user/:id', async (request, reply) => {
  const { id } = request.params as { id: string };
  return { id, name: `User ${id}` };
});

// Route with middleware (hooks in Fastify)
fastify.addHook('preHandler', async (request, reply) => {
  if (request.url === '/middleware') {
    request.startTime = Date.now();
    request.processed = true;
  }
});

fastify.get('/middleware', async (request, reply) => {
  return { 
    processed: request.processed, 
    duration: Date.now() - request.startTime 
  };
});

// POST with body parsing
fastify.post('/echo', async (request, reply) => {
  return { received: request.body };
});

const start = async () => {
  try {
    await fastify.listen({ port });
    console.log(`Fastify server running on port ${port}`);
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

process.on('SIGINT', async () => {
  console.log('Shutting down Fastify server...');
  await fastify.close();
  process.exit(0);
});

start();

export default fastify;