import express, { Express, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { errorHandler } from '@/middlewares/errorHandler';
import { AppError } from '@/utils/AppError';
import { morganDev, morganProd } from '@/config/morgan';
import { helmetDev, helmetProd } from '@/config/helmet';
import router from './routes';

dotenv.config();

const app: Express = express();

// Security Middleware
if (process.env.NODE_ENV === 'production') {
  app.use(helmetProd);
} else {
  app.use(helmetDev);
}

// CORS configuration
app.use(
  cors({
    origin:
      process.env.NODE_ENV === 'production'
        ? process.env.ALLOWED_ORIGINS?.split(',')
        : 'http://localhost:3001',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
    maxAge: 600,
  })
);

// Logging Middleware
if (process.env.NODE_ENV === 'production') {
  app.use(morganProd);
} else {
  app.use(morganDev);
}

// Body Parser Middleware
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));

// Routes
app.use('/api', router);

// Handle undefined routes
app.all('*', (req: Request, res: Response, next: NextFunction) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

// Error handling middleware
app.use(errorHandler);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  // server started
});

export default app;
