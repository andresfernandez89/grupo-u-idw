import cors from "cors";
import express from "express";
import { testConexion } from "./src/config/db.js";
import v1Router from "./src/routes/v1/index.js";

process.loadEnvFile();

function validateEnv() {
  const missing = [];

  if (!process.env.DB_HOST) missing.push("DB_HOST");
  if (!process.env.DB_USER) missing.push("DB_USER");
  if (!process.env.DB_PASSWORD) missing.push("DB_PASSWORD");
  if (!process.env.DB_NAME) missing.push("DB_NAME");
  if (!process.env.CORS_ORIGIN) missing.push("CORS_ORIGIN");

  if (missing.length > 0) {
    throw new Error(
      `Faltan variables de entorno obligatorias: ${missing.join(", ")}`,
    );
  }
}

validateEnv();

await testConexion();

const app = express();
const PORT = process.env.PORT || 3000;

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

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});

export default app;
