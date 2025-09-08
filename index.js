const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoute");
const foodRoutes = require("./routes/foodRoute");
const foodPreferencesRoute = require("./routes/foodPreferencesRoute");
const taskRoutes = require("./routes/taskRoute");
const testRoute = require("./routes/testRoute");
const profileRoute = require("./routes/profileRoute");

dotenv.config();
const app = express();
connectDB();

// ---- CORS FIRST (before any routes/middleware) ----
const allowedOrigins = [
  "http://localhost:4200",
  "https://backend-node-kappa.vercel.app"
];

const corsOptions = {
  origin: (origin, cb) => {
    if (!origin || allowedOrigins.includes(origin)) return cb(null, true);
    return cb(new Error("Not allowed by CORS"));
  },
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: [
    "Content-Type",
    "Authorization",
    "apikey",
    "x-client-info"
  ],
  credentials: true, // set true only if you actually use cookies
  optionsSuccessStatus: 204
};

app.use(cors(corsOptions));
// Handle preflight explicitly
app.options("*", cors(corsOptions));

// ---------------------------------------------------

app.use(express.json());

// routes
app.use("/api/auth", authRoutes);
app.use("/api/food", foodRoutes);
app.use("/api/food-preferences", foodPreferencesRoute);
app.use("/api/task", taskRoutes);        // e.g. GET /api/task/stats
app.use("/api/v1", profileRoute);
app.use("/api", testRoute);

// optional: health check
app.get("/health", (_req, res) => res.status(200).send("ok"));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
