// Express running on Bun runtime
import express from 'express';

const port = parseInt(process.env.PORT || '3005');
const app = express();

app.use(express.json());

// Simple route
app.get('/', (req, res) => {
  res.send('Hello World');
});

// JSON response
app.get('/json', (req, res) => {
  res.json({ message: 'Hello World', timestamp: Date.now() });
});

// Route with params
app.get('/user/:id', (req, res) => {
  res.json({ id: req.params.id, name: `User ${req.params.id}` });
});

// Route with middleware
app.get('/middleware', 
  (req, res, next) => {
    req.startTime = Date.now();
    next();
  },
  (req, res, next) => {
    req.processed = true;
    next();
  },
  (req, res) => {
    res.json({ 
      processed: req.processed, 
      duration: Date.now() - req.startTime 
    });
  }
);

// POST with body parsing
app.post('/echo', (req, res) => {
  res.json({ received: req.body });
});

const server = app.listen(port, () => {
  console.log(`Express (Bun) server running on port ${port}`);
});

process.on('SIGINT', () => {
  console.log('Shutting down Express (Bun) server...');
  server.close();
  process.exit(0);
});

export default server;