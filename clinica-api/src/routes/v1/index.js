import { Router } from "express";
import authRoutes from "./auth.js";
import especialidadesRoutes from "./especialidades.js";
import estadisticasRoutes from "./estadisticas.js";
import medicosRoutes from "./medicos.js";
import obrasSocialesRoutes from "./obras_sociales.js";
import pacientesRoutes from "./pacientes.js";
import turnosRoutes from "./turnos.js";

const router = Router();

router.use("/auth", authRoutes);
router.use("/especialidades", especialidadesRoutes);
router.use("/obras-sociales", obrasSocialesRoutes);
router.use("/medicos", medicosRoutes);
router.use("/pacientes", pacientesRoutes);
router.use("/turnos", turnosRoutes);
router.use("/estadisticas", estadisticasRoutes);

export default router;
