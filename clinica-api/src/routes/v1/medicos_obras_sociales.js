import { Router } from "express";
import medicosObrasSocialesController from "../../controllers/medicos_obras_sociales.js";
import { handleValidationErrors } from "../../middlewares/validacion.js";
import {
  browseMedicoObraSocialValidator,
  createMedicoObraSocialValidator,
  deleteMedicoObraSocialValidator,
  getByIdMedicoObraSocialValidator,
  updateMedicoObraSocialValidator,
} from "../../validators/medicos_obras_sociales.js";

const router = Router();

router.get(
  "/",
  browseMedicoObraSocialValidator,
  handleValidationErrors,
  medicosObrasSocialesController.browse.bind(medicosObrasSocialesController),
);


router.post(
  "/",
  createMedicoObraSocialValidator,
  handleValidationErrors,
  medicosObrasSocialesController.create.bind(medicosObrasSocialesController),
);

router.delete(
  "/:id_medico/:id_obra_social",
  deleteMedicoObraSocialValidator,
  handleValidationErrors,
  medicosObrasSocialesController.delete.bind(medicosObrasSocialesController),
);

export default router;
