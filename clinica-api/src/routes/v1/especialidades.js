import { Router } from "express";
import especialidadController from "../../controllers/especialidades.js";
import { handleValidationErrors } from "../../middlewares/validacion.js";
import { createEspecialidadValidator } from "../../validators/especialidades.validators.js";

const router = Router();

router.post(
  "/",
  createEspecialidadValidator,
  handleValidationErrors,
  especialidadController.create.bind(especialidadController),
);

export default router;
