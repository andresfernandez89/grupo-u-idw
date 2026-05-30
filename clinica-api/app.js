import cors from "cors";
import express from "express";
import v1Router from "./src/routes/v1/index.js";

const app = express();

// Middlewares
const corsOptions = {
  origin: process.env.CORS_ORIGIN,
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
};

app.use(cors(corsOptions));
app.use(express.json());

// Routes
app.use("/api", v1Router);
app.use("/api/v1", v1Router);

export default app;
