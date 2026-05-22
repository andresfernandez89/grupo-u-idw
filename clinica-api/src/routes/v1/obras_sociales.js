import { Router } from "express";
import obrasSocialesController from "../../controllers/obras_sociales.js";
import { handleValidationErrors } from "../../middlewares/validacion.js";
import {
  browseObraSocialValidator,
  getByIdObraSocialValidator,
} from "../../validators/obras_sociales.js";

const router = Router();

router.get(
  "/",
  browseObraSocialValidator,
  handleValidationErrors,
  obrasSocialesController.browse.bind(obrasSocialesController),
);

router.get(
  "/:id",
  getByIdObraSocialValidator,
  handleValidationErrors,
  obrasSocialesController.findById.bind(obrasSocialesController),
);

export default router;
