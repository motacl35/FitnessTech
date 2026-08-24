const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();

const userRoutes = require("./routes/users");
const authRoutes = require("./routes/auth");
const productRoutes = require("./routes/products");
const membershipRoutes = require("./routes/memberships");
const contactRoutes = require("./routes/contact");
const workoutRoutes = require("./routes/workouts");
const aiRoutes = require("./routes/ai");

const app = express();

app.use(cors());
app.use(express.json({ limit: "10mb" }));

app.get("/api/health", (req, res) => {
  res.json({ message: "Server is running" });
});

app.use("/api/v1/users", userRoutes);
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/products", productRoutes);
app.use("/api/v1/memberships", membershipRoutes);
app.use("/api/v1/contact", contactRoutes);
app.use("/api/v1/workouts", workoutRoutes);
app.use("/api/v1/ai", aiRoutes);

const PORT = process.env.PORT || 3001;

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB connected");
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch((err) => console.error("MongoDB connection error:", err));