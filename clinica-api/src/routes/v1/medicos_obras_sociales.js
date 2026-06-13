import { Router } from "express";
import { authenticate } from "../../middlewares/auth.js";
import { authorize } from "../../middlewares/role.js";
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
  authenticate,
  authorize(3),
  browseMedicoObraSocialValidator,
  handleValidationErrors,
  medicosObrasSocialesController.browse.bind(medicosObrasSocialesController),
);

router.get(
  "/:id",
  authenticate,
  authorize(3),
  getByIdMedicoObraSocialValidator,
  handleValidationErrors,
  medicosObrasSocialesController.findById.bind(medicosObrasSocialesController),
);

router.post(
  "/",
  authenticate,
  authorize(3),
  createMedicoObraSocialValidator,
  handleValidationErrors,
  medicosObrasSocialesController.create.bind(medicosObrasSocialesController),
);

router.put(
  "/:id",
  authenticate,
  authorize(3),
  updateMedicoObraSocialValidator,
  handleValidationErrors,
  medicosObrasSocialesController.update.bind(medicosObrasSocialesController),
);

router.delete(
  "/:id",
  authenticate,
  authorize(3),
  deleteMedicoObraSocialValidator,
  handleValidationErrors,
  medicosObrasSocialesController.delete.bind(medicosObrasSocialesController),
);

export default router;
