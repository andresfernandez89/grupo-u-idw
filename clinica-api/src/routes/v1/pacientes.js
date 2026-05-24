import { Router } from "express";
import pacientesController from "../../controllers/pacientes.js";
import { handleValidationErrors } from "../../middlewares/validacion.js";
import {
  browsePacienteValidator,
  createPacienteValidator,
  deletePacienteValidator,
  getByIdPacienteValidator,
  updatePacienteValidator,
} from "../../validators/pacientes.js";

const router = Router();

router.get(
  "/",
  browsePacienteValidator,
  handleValidationErrors,
  pacientesController.browse.bind(pacientesController),
);

router.get(
  "/:id",
  getByIdPacienteValidator,
  handleValidationErrors,
  pacientesController.findById.bind(pacientesController),
);

router.post(
  "/",
  createPacienteValidator,
  handleValidationErrors,
  pacientesController.create.bind(pacientesController),
);

router.put(
  "/:id",
  updatePacienteValidator,
  handleValidationErrors,
  pacientesController.update.bind(pacientesController),
);

router.delete(
  "/:id",
  deletePacienteValidator,
  handleValidationErrors,
  pacientesController.delete.bind(pacientesController),
);

export default router;
