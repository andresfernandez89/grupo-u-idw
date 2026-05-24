import { Router } from "express";
import usuarioController from "../../controllers/usuarios.js";
import { handleValidationErrors } from "../../middlewares/validacion.js";
import {
  browseUsuariosValidator,
  createUsuarioValidator,
  updateUsuarioValidator,
  deleteUsuarioValidator,
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

router.post(
  "/",
  createUsuarioValidator,
  handleValidationErrors,
  usuarioController.create.bind(usuarioController),
);

router.put(
  "/:id",
  updateUsuarioValidator,
  handleValidationErrors,
  usuarioController.update.bind(usuarioController),
);

router.delete(
  "/:id",
  deleteUsuarioValidator,
  handleValidationErrors,
  usuarioController.delete.bind(usuarioController),
);

export default router;
