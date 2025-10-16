import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const app = express();
const PORT = Number(process.env.PORT) || 5001;
const HOST = process.env.HOST || '0.0.0.0';

// Middleware
app.use(cors());
app.use(express.json());
// More specific CORS for frontend (fix typo and allow credentials)
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));

// Register API routes
// Dynamically resolve the contact router to be resilient across runtimes (ts-node / compiled JS)
async function loadRoutes() {
  try {
    // try compiled JS first
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const mod = await import('./routes/contact.js');
    app.use('/api/contact', mod.default || mod);
  } catch (e1) {
    try {
      // fallback to TS source (ts-node / dev)
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      const mod = await import('./routes/contact');
      app.use('/api/contact', mod.default || mod);
    } catch (e2) {
      console.error('Failed to load contact route:', e1, e2);
    }
  }
}

loadRoutes();


// Test routes
app.get('/', (req, res) => {
  res.send('Backend is running');
});

app.get('/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    pid: process.pid, 
    port: PORT,
    database: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected'
  });
});

// Connect to MongoDB and conditionally start the server
async function startServer() {
  try {
    await mongoose.connect(process.env.MONGODB_URI!)
    console.log('Connected to MongoDB')

    // Only start a long-running server when not running in Vercel serverless environment
    if (!process.env.VERCEL) {
      const server = app.listen(PORT, HOST, () => {
        console.log(`Server is running on http://${HOST}:${PORT}`);
      });

      server.on('error', (err: any) => {
        if (err.code === 'EADDRINUSE') {
          console.error(`Port ${PORT} is already in use. Please free the port or set PORT env var.`);
          process.exit(1);
        }
        console.error('Server error:', err);
        process.exit(1);
      });
    }
  } catch (error) {
    console.error('MongoDB connection error:', error);
    if (!process.env.VERCEL) process.exit(1);
  }
}

startServer()

export default app