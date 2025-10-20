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
app.use(express.json());

// Configure CORS to accept both forms of the frontend origin
// and common local dev origins. Normalize trailing slashes for comparison.
const rawFrontend = process.env.FRONTEND_URL || 'https://sami-portfolio-nine.vercel.app';
const normalize = (u: string) => u.replace(/\/+$/, '');
const allowedOrigins = new Set([
  normalize(rawFrontend),
  normalize(rawFrontend) + '/',
  normalize('http://localhost:3000'),
  normalize('http://localhost:5173'),
  normalize('http://127.0.0.1:5173'),
]);

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (mobile apps, curl, server-side)
    if (!origin) return callback(null, true);
    const norm = normalize(origin);
    if (allowedOrigins.has(norm) || allowedOrigins.has(norm + '/')) {
      return callback(null, true);
    }
    return callback(new Error('CORS policy: Origin not allowed'), false);
  },
  credentials: true,
}));
 
// JSON error handler (ensures API returns JSON instead of HTML 502 pages)
app.use((err: any, req: any, res: any, next: any) => {
  console.error('Unhandled error:', err);
  res.status(err.status || 500).json({ error: err.message || 'Internal Server Error' });
});

// Register API routes
import contactRouter from './routes/contact.js';
app.use('/api/contact', contactRouter);


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

// Connect to MongoDB and start server
// Connect to MongoDB. In serverless environments we still want the DB connected
// but we should avoid starting an HTTP listener (Vercel/Netlify functions import
// this module and handle the HTTP layer themselves). Export `app` so it can be
// mounted by other runtimes.
mongoose.connect(process.env.MONGODB_URI!)
  .then(() => {
    console.log('Connected to MongoDB');

    // Only start the HTTP server when this file is run directly (local dev)
    // or when not running in a serverless environment.
    const isServerless = !!process.env.VERCEL || !!process.env.FUNCTIONS_ENV;
    if (!isServerless && require.main === module) {
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
    } else {
      console.log('Server module loaded (serverless or imported). HTTP listener not started.');
    }
  })
  .catch((error) => {
    console.error('MongoDB connection error:', error);
    // In serverless contexts it's often better to throw so the platform logs it
    // and marks the deployment as failed. Locally, exit with error.
    if (require.main === module) process.exit(1);
    throw error;
  });

export default app;