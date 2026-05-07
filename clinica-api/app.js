import express from "express";
import { testConexion } from "./src/config/db.js";
import v1Router from "./src/routes/v1/index.js";

process.loadEnvFile();

await testConexion();

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(express.json());

// Routes
app.use("/api", v1Router);
app.use("/api/v1", v1Router);

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});

export default app;
