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
    throw new Error(
      `Faltan variables de entorno obligatorias: ${missing.join(", ")}`,
    );
  }
}

validateEnv();

await testConexion();

const parsedPort = Number.parseInt(process.env.PORT || "3000", 10);
const PORT = Number.isNaN(parsedPort) ? 3000 : parsedPort;

function startServer(port) {
  return new Promise((resolve, reject) => {
    const server = app.listen(port);

    server.once("listening", () => resolve(server));
    server.once("error", reject);
  });
}

async function startServerFrom(initialPort) {
  let port = initialPort;

  while (true) {
    try {
      return await startServer(port);
    } catch (error) {
      if (error.code !== "EADDRINUSE") {
        throw error;
      }

      console.warn(`Puerto ${port} ocupado, probando ${port + 1}.`);
      port += 1;
    }
  }
}

const server = await startServerFrom(PORT);

const address = server.address();
const actualPort = typeof address === "object" && address ? address.port : PORT;

console.log(`Servidor corriendo en http://localhost:${actualPort}`);
