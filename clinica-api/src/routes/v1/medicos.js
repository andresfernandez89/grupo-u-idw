import { Router } from "express";
import medicoController from "../../controllers/medicos.js";
import { handleValidationErrors } from "../../middlewares/validacion.js";
import {
  browseMedicoValidator,
  createMedicoValidator,
  deleteMedicoValidator,
  getByEspecialidadMedicoValidator,
  getByIdMedicoValidator,
  updateMedicoValidator,
} from "../../validators/medicos.js";

const router = Router();

router.get(
  "/",
  browseMedicoValidator,
  handleValidationErrors,
  medicoController.browse.bind(medicoController),
);

router.get(
  "/especialidad/:id_especialidad",
  getByEspecialidadMedicoValidator,
  handleValidationErrors,
  medicoController.findByEspecialidad.bind(medicoController),
);

router.get(
  "/:id",
  getByIdMedicoValidator,
  handleValidationErrors,
  medicoController.findById.bind(medicoController),
);

router.post(
  "/",
  createMedicoValidator,
  handleValidationErrors,
  medicoController.create.bind(medicoController),
);

router.put(
  "/:id",
  updateMedicoValidator,
  handleValidationErrors,
  medicoController.update.bind(medicoController),
);

router.delete(
  "/:id",
  deleteMedicoValidator,
  handleValidationErrors,
  medicoController.delete.bind(medicoController),
);

export default router;
