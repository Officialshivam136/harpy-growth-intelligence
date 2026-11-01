import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDB } from './config/db.js';
import healthRoutes from './routes/healthRoutes.js';
import analyticsRoutes from './routes/analyticsRoutes.js';
import brandRoutes from './routes/brandRoutes.js';
import campaignRoutes from './routes/campaignRoutes.js';
import productRoutes from './routes/productRoutes.js';
import alertRoutes from './routes/alertRoutes.js';
import reportRoutes from './routes/reportRoutes.js';
import aiRoutes from './routes/aiRoutes.js';
import importRoutes from './routes/importRoutes.js';
import { requireAgencyAuth } from './middleware/authMiddleware.js';
import { errorHandler } from './middleware/errorHandler.js';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// CORS configuration (allow Vite client)
const allowedOrigins = [
  'http://localhost:5173',
  'http://127.0.0.1:5173',
  process.env.CLIENT_ORIGIN,
].filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (e.g. mobile apps or curl) or if origin is in whitelist
      if (!origin || allowedOrigins.includes(origin) || process.env.NODE_ENV !== 'production') {
        callback(null, true);
      } else {
        callback(new Error('Blocked by CORS policy'));
      }
    },
    credentials: true,
  })
);

app.use(express.json());

// Request logger middleware
app.use((req, res, next) => {
  const start = Date.now();
  res.on('finish', () => {
    const duration = Date.now() - start;
    console.log(`[API] ${req.method} ${req.originalUrl} ${res.statusCode} - ${duration}ms`);
  });
  next();
});

// Multi-tenant Agency Authentication & Context Scoping
app.use(requireAgencyAuth);

// API Routes
app.use('/api/health', healthRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/brands', brandRoutes);
app.use('/api/campaigns', campaignRoutes);
app.use('/api/products', productRoutes);
app.use('/api/alerts', alertRoutes);
app.use('/api/reports', reportRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/import', importRoutes);

// Root fallback
app.get('/', (req, res) => {
  res.json({
    name: 'Harpy Growth Intelligence API',
    status: 'online',
    docs: '/api/health',
  });
});

// 404 API Handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `API endpoint not found: ${req.method} ${req.originalUrl}`,
  });
});

// Centralised Global Error Handler
app.use(errorHandler);

// Start Express server and connect to database
async function startServer() {
  await connectDB();
  app.listen(PORT, () => {
    console.log(`[Harpy API] Express server running at http://localhost:${PORT}`);
    console.log(`[Harpy API] Health check available at http://localhost:${PORT}/api/health`);
  });
}

startServer();

export default app;

