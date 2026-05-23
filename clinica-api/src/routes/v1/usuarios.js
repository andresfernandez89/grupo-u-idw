import { Router } from "express";
import usuarioController from "../../controllers/usuarios.js";
import { handleValidationErrors } from "../../middlewares/validacion.js";
import {
  browseUsuariosValidator,
  getByIdUsuarioValidator,
} from "../../validators/usuarios.js";

const router = Router();

router.get(
  "/",
  browseUsuariosValidator,
  handleValidationErrors,
  usuarioController.browse.bind(usuarioController),
);

router.get(
  "/:id",
  getByIdUsuarioValidator,
  handleValidationErrors,
  usuarioController.findById.bind(usuarioController),
);

export default router;
