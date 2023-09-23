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

app.use(express.json());

app.get("/", (req, res) => {
  res.render(path.join(__dirname, "/view/week2"));
});

app.use(authRoutes);
app.use(dataRoutes);

app.listen(3000, () => {
  console.log("Server started on http://localhost:3000");
});

export default app;
