import { testConexion } from "./src/config/db.js";
import app from "./app.js";

process.loadEnvFile();

function validateEnv() {
  const missing = [];

  if (!process.env.DB_HOST) missing.push("DB_HOST");
  if (!process.env.DB_USER) missing.push("DB_USER");
  if (!process.env.DB_PASSWORD) missing.push("DB_PASSWORD");
  if (!process.env.DB_NAME) missing.push("DB_NAME");
  if (!process.env.CORS_ORIGIN) missing.push("CORS_ORIGIN");

  if (missing.length > 0) {
    throw new Error(`Faltan variables de entorno obligatorias: ${missing.join(", ")}`);
  }
}

validateEnv();

await testConexion();

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
