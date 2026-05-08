import { Router } from "express";
import especialidadController from "../../controllers/especialidades.js";
import { handleValidationErrors } from "../../middlewares/validacion.js";
import {
  createEspecialidadValidator,
  deleteEspecialidadValidator,
  getByIdEspecialidadValidator,
  updateEspecialidadValidator,
} from "../../validators/especialidades.js";

const router = Router();

router.get("/", especialidadController.browse.bind(especialidadController));

router.get(
  "/:id",
  getByIdEspecialidadValidator,
  handleValidationErrors,
  especialidadController.findById.bind(especialidadController),
);

router.post(
  "/",
  createEspecialidadValidator,
  handleValidationErrors,
  especialidadController.create.bind(especialidadController),
);

router.put(
  "/:id",
  updateEspecialidadValidator,
  handleValidationErrors,
  especialidadController.update.bind(especialidadController),
);

router.delete(
  "/:id",
  deleteEspecialidadValidator,
  handleValidationErrors,
  especialidadController.delete.bind(especialidadController),
);

export default router;
