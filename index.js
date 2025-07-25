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

app.use(express.json());
app.use(cors());

app.use("/api/auth", authRoutes);
app.use("/api/food", foodRoutes);
app.use("/api/food-preferences", foodPreferencesRoute);
app.use("/api/task", taskRoutes);
app.use("/api/v1", profileRoute);
app.use("/api", testRoute);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
