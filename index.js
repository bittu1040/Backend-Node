import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './config/db.js';
import authRoutes from './routes/authRoute.js';
import foodRoutes from './routes/foodRoute.js';
import foodPreferencesRoute from './routes/foodPreferencesRoute.js';
import taskRoutes from './routes/taskRoute.js';
import testRoute from './routes/testRoute.js';
import profileRoute from './routes/profileRoute.js';

dotenv.config();
const app = express();
await connectDB();

const allowedOrigins = [
  "http://localhost:4200",
  "https://backend-node-kappa.vercel.app",
  "https://daily-tasks-tracker.vercel.app"
];

const corsOptions = {
  origin: (origin, cb) => {
    if (!origin || allowedOrigins.includes(origin)) return cb(null, true);
    return cb(new Error("Not allowed by CORS - Origin: " + origin));
  },
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: [
    "Content-Type",
    "Authorization",
    "apikey",
    "x-client-info"
  ],
  credentials: true,
  optionsSuccessStatus: 204
};

app.use(cors(corsOptions));
app.use(express.json());

// routes
app.use('/api/auth', authRoutes);
app.use('/api/food', foodRoutes);
app.use('/api/food-preferences', foodPreferencesRoute);
app.use('/api/task', taskRoutes);
app.use('/api/v1', profileRoute);
app.use('/api', testRoute);

// health check
app.get("/health", (_req, res) => res.status(200).send("ok"));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));