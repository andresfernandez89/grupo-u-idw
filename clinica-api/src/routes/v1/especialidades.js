import { Router } from "express";
import especialidadController from "../../controllers/especialidades.js";
import { handleValidationErrors } from "../../middlewares/validacion.js";
import {
  createEspecialidadValidator,
  deleteEspecialidadValidator,
  updateEspecialidadValidator,
  getByIdEspecialidadValidator
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

router.get("/",(req,res)=> controller.browse(req,res))

router.get("/:id", getByIdEspecialidadValidator , (req,res) => controller.findById(req,res))

export default router;
