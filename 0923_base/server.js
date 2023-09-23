import express from "express";
import path from "path";
import cookieParser from "cookie-parser";
import authRoutes from "./routes/auth.js";
import dataRoutes from "./routes/data.js";
import dataUtils from "./utils/getDataUtils.js";
import fileUtils from "./utils/fileUtils.js";
const app = express();

// Middleware
app.use(express.json());
//app.use(cookieParser());

// Routes
app.get("/", (req, res) => {
  res.sendFile(path.join("/home/dobby/BSG/week3", "/data/week2.html"));
});

/* app.use(fileUtils);
app.use(dataUtils); */
app.use(authRoutes);
app.use(dataRoutes);

app.listen(3000, () => {
  console.log("Server started on http://localhost:3000");
});

export default app;
