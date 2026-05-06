import { Router } from "express";
import { EspecialidadesController } from "../controllers/especialidades.js";
import { validarActualizarEspecialidad } from "../validators/especialidades.js";

const router = Router();
const controller = new EspecialidadesController();

router.put("/:id", validarActualizarEspecialidad, (req, res) =>
  controller.update(req, res),
);
 router.get("/",(req,res)=> controller.browse(req,res))

router.get("/:id", (req,res) => controller.findById(req,res))

export default router;