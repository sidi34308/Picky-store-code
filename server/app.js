require("dotenv").config();
const express = require("express");
const app = express();
const adminRoutes = require("./routes/admin");
const authRoutes = require("./routes/auth");

app.use(express.json());
app.use("/api/admin", adminRoutes);
app.use("/api/auth", authRoutes);

// ...existing code...

module.exports = app;
