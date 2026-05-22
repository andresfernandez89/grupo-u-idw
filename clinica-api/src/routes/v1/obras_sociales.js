import { Router } from "express";
import obrasSocialesController from "../../controllers/obras_sociales.js";
import { handleValidationErrors } from "../../middlewares/validacion.js";
import {
  browseObraSocialValidator,
  createObraSocialValidator,
  deleteObraSocialValidator,
  getByIdObraSocialValidator,
  updateObraSocialValidator,
} from "../../validators/obras_sociales.js";

const router = Router();

router.get(
  "/",
  browseObraSocialValidator,
  handleValidationErrors,
  obrasSocialesController.browse.bind(obrasSocialesController),
);

router.post(
  "/",
  createObraSocialValidator,
  handleValidationErrors,
  obrasSocialesController.create.bind(obrasSocialesController),
);

router.delete(
  "/:id",
  deleteObraSocialValidator,
  handleValidationErrors,
  obrasSocialesController.delete.bind(obrasSocialesController),
);

router.put(
  "/:id",
  updateObraSocialValidator,
  handleValidationErrors,
  obrasSocialesController.update.bind(obrasSocialesController),
);

router.get(
  "/:id",
  getByIdObraSocialValidator,
  handleValidationErrors,
  obrasSocialesController.findById.bind(obrasSocialesController),
);

export default router;
