import cors from "cors";
import express from "express";
import fs from "fs";
import helmet from "helmet";
import morgan from "morgan";
import path from "path";
import { createStream } from "rotating-file-stream";
import swaggerUi from "swagger-ui-express";
import swaggerSpecs from "./src/config/swagger.js";
import v1Router from "./src/routes/v1/index.js";

const app = express();

// Security headers (hardening)
app.use(helmet());

// Access logs with monthly rotation
const logsDir = path.resolve("logs");
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir, { recursive: true });
}

const accessLogStream = createStream("access.log", {
  interval: "1M",
  path: logsDir,
  compress: "gzip",
  maxFiles: 36,
});

app.use(morgan("combined", { stream: accessLogStream }));

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

// Swagger documentation UI
app.use("/api/v1/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpecs));

export default app;
