import { Router } from "express";
import { authenticate } from "../../middlewares/auth.js";
import { authorize } from "../../middlewares/role.js";
import usuarioController from "../../controllers/usuarios.js";
import { handleValidationErrors } from "../../middlewares/validacion.js";
import { uploadSingle } from "../../config/multer.js";
import {
  browseUsuariosValidator,
  createUsuarioValidator,
  updateUsuarioValidator,
  deleteUsuarioValidator,
  getByIdUsuarioValidator,
} from "../../validators/usuarios.js";

const router = Router();

/**
 * @openapi
 * /usuarios:
 *   get:
 *     summary: Obtiene la lista de usuarios
 *     tags: [Usuarios]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de usuarios
 *       401:
 *         description: No autenticado
 *       500:
 *         description: Error interno
 */
router.get(
  "/",
  authenticate,
  authorize(3),
  browseUsuariosValidator,
  handleValidationErrors,
  usuarioController.browse.bind(usuarioController),
);

/**
 * @openapi
 * /usuarios/{id}:
 *   get:
 *     summary: Obtiene un usuario por su ID
 *     tags: [Usuarios]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del usuario
 *     responses:
 *       200:
 *         description: Usuario encontrado
 *       401:
 *         description: No autenticado
 *       404:
 *         description: Usuario no encontrado
 *       500:
 *         description: Error interno
 */
router.get(
  "/:id",
  authenticate,
  authorize(3),
  getByIdUsuarioValidator,
  handleValidationErrors,
  usuarioController.findById.bind(usuarioController),
);

/**
 * @openapi
 * /usuarios:
 *   post:
 *     summary: Crea un nuevo usuario
 *     tags: [Usuarios]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required: [documento, email, contrasenia, rol, apellido, nombres]
 *             properties:
 *               documento:
 *                 type: string
 *                 maxLength: 20
 *                 description: Documento de identidad del usuario
 *               email:
 *                 type: string
 *                 format: email
 *               contrasenia:
 *                 type: string
 *               rol:
 *                 type: integer
 *                 enum: [1, 2, 3]
 *               apellido:
 *                 type: string
 *               nombres:
 *                 type: string
 *               foto:
 *                 type: string
 *                 format: binary
 *                 description: Foto de perfil (opcional)
 *     responses:
 *       201:
 *         description: Usuario creado
 *       401:
 *         description: No autenticado
 *       409:
 *         description: Email ya registrado
 *       500:
 *         description: Error interno
 */
router.post(
  "/",
  uploadSingle("foto"),
  createUsuarioValidator,
  handleValidationErrors,
  usuarioController.create.bind(usuarioController),
);

/**
 * @openapi
 * /usuarios/{id}:
 *   put:
 *     summary: Actualiza un usuario existente
 *     tags: [Usuarios]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del usuario
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *               rol:
 *                 type: integer
 *                 enum: [1, 2, 3]
 *               apellido:
 *                 type: string
 *               nombres:
 *                 type: string
 *               foto:
 *                 type: string
 *                 format: binary
 *                 description: Foto de perfil (opcional)
 *     responses:
 *       200:
 *         description: Usuario actualizado
 *       401:
 *         description: No autenticado
 *       404:
 *         description: Usuario no encontrado
 *       409:
 *         description: Email ya registrado
 *       500:
 *         description: Error interno
 */
router.put(
  "/:id",
  authenticate,
  authorize(3),
  uploadSingle("foto"),
  updateUsuarioValidator,
  handleValidationErrors,
  usuarioController.update.bind(usuarioController),
);

/**
 * @openapi
 * /usuarios/{id}:
 *   delete:
 *     summary: Elimina (desactiva) un usuario
 *     tags: [Usuarios]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del usuario
 *     responses:
 *       204:
 *         description: Usuario eliminado
 *       401:
 *         description: No autenticado
 *       404:
 *         description: Usuario no encontrado
 *       500:
 *         description: Error interno
 */
router.delete(
  "/:id",
  authenticate,
  authorize(3),
  deleteUsuarioValidator,
  handleValidationErrors,
  usuarioController.delete.bind(usuarioController),
);

export default router;
