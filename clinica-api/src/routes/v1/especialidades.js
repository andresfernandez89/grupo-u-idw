import { Router } from "express";
import especialidadController from "../../controllers/especialidades.js";
import { handleValidationErrors } from "../../middlewares/validacion.js";
import {
  createEspecialidadValidator,
  deleteEspecialidadValidator,
  updateEspecialidadValidator,
} from "../../validators/especialidades.js";

const router = Router();

router.post(
  "/",
  createEspecialidadValidator,
  handleValidationErrors,
  especialidadController.create.bind(especialidadController),
);

router.put("/:id", updateEspecialidadValidator, (req, res) =>
  controller.update(req, res),
);

router.delete(
  "/:id",
  deleteEspecialidadValidator,
  handleValidationErrors,
  especialidadController.delete.bind(especialidadController),
);
export default router;
