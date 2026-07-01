import express, { Request, Response } from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import dotenv from 'dotenv';
import authRoutes from './routes/authRoutes';
import productRoutes from './routes/productRoutes';
import orderRoutes from './routes/orderRoutes';
import reviewRoutes from './routes/reviewRoutes';
import adminRoutes from './routes/adminRoutes';
import { errorHandler } from './middleware/errorHandler';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: ['http://localhost:5173', 'http://127.0.0.1:5173', 'http://localhost:3000'],
  credentials: true,
}));
app.use(express.json());
app.use(cookieParser());
app.use(morgan('dev'));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/admin', adminRoutes);

// Health Check
app.get('/api/health', (req: Request, res: Response) => {
  res.status(200).json({ status: 'OK', message: "Bindi's Cupcakery Backend is Running!" });
});

// Root
app.get('/', (req: Request, res: Response) => {
  res.send("Welcome to Bindi's Cupcakery API");
});

// Error Handler
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`🚀 Express backend server running on http://localhost:${PORT}`);
});

export default app;
