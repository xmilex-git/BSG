import express from "express";
import path from "path";
import cookieParser from "cookie-parser";
import authRoutes from "./routes/auth.js";
import dataRoutes from "./routes/data.js";
import { fileURLToPath } from "url";
import { dirname } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const app = express();

// Middleware
app.use(express.json());
//app.use(cookieParser());

// Routes
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "/data/week2.html"));
});

app.use(authRoutes);
app.use(dataRoutes);

app.listen(3000, () => {
  console.log("Server started on http://localhost:3000");
});

export default app;
