import { Router } from "express";
import { authenticate } from "../../middlewares/auth.js";
import pacientesController from "../../controllers/pacientes.js";
import { handleValidationErrors } from "../../middlewares/validacion.js";
import {
  browsePacienteValidator,
  createPacienteValidator,
  deletePacienteValidator,
  getByIdPacienteValidator,
  updatePacienteValidator,
} from "../../validators/pacientes.js";

const router = Router();

/**
 * @openapi
 * /pacientes:
 *   get:
 *     summary: Obtiene la lista de pacientes con paginación y filtros
 *     tags: [Pacientes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: apellido
 *         schema:
 *           type: string
 *           maxLength: 100
 *         required: false
 *         description: Filtrar por apellido exacto
 *       - in: query
 *         name: nombres
 *         schema:
 *           type: string
 *           maxLength: 100
 *         required: false
 *         description: Filtrar por nombres exactos
 *       - in: query
 *         name: id_obra_social
 *         schema:
 *           type: integer
 *           minimum: 1
 *         required: false
 *         description: Filtrar por ID de obra social
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 1
 *         required: false
 *         description: Número de página
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *           default: 10
 *         required: false
 *         description: Cantidad de resultados por página
 *       - in: query
 *         name: sort
 *         schema:
 *           type: string
 *           enum: [id_paciente, apellido, nombres, id_obra_social]
 *         required: false
 *         description: Campo por el cual ordenar
 *       - in: query
 *         name: order
 *         schema:
 *           type: string
 *           enum: [asc, desc]
 *         required: false
 *         description: Dirección del ordenamiento
 *     responses:
 *       200:
 *         description: Lista paginada de pacientes
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Paciente'
 *                 pagination:
 *                   $ref: '#/components/schemas/Paginacion'
 *       500:
 *         description: Error interno del servidor
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get(
  "/",
  authenticate,
  browsePacienteValidator,
  handleValidationErrors,
  pacientesController.browse.bind(pacientesController),
);

/**
 * @openapi
 * /pacientes/{id}:
 *   get:
 *     summary: Obtiene un paciente por su ID
 *     tags: [Pacientes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *           minimum: 1
 *         description: ID del paciente
 *     responses:
 *       200:
 *         description: Paciente encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Paciente'
 *       404:
 *         description: Paciente no encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Error interno del servidor
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get(
  "/:id",
  authenticate,
  getByIdPacienteValidator,
  handleValidationErrors,
  pacientesController.findById.bind(pacientesController),
);

/**
 * @openapi
 * /pacientes:
 *   post:
 *     summary: Crea un nuevo paciente
 *     tags: [Pacientes]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/PacienteCreate'
 *     responses:
 *       201:
 *         description: Paciente creado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 data:
 *                   $ref: '#/components/schemas/Paciente'
 *       400:
 *         description: Error de validación (obra social inactiva)
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       409:
 *         description: Conflicto (usuario ya tiene paciente asociado)
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Error interno del servidor
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.post(
  "/",
  authenticate,
  createPacienteValidator,
  handleValidationErrors,
  pacientesController.create.bind(pacientesController),
);

/**
 * @openapi
 * /pacientes/{id}:
 *   put:
 *     summary: Actualiza un paciente existente
 *     tags: [Pacientes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *           minimum: 1
 *         description: ID del paciente
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/PacienteCreate'
 *     responses:
 *       200:
 *         description: Paciente modificado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 data:
 *                   $ref: '#/components/schemas/Paciente'
 *       400:
 *         description: Error de validación (obra social inactiva)
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Paciente no encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Error interno del servidor
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.put(
  "/:id",
  authenticate,
  updatePacienteValidator,
  handleValidationErrors,
  pacientesController.update.bind(pacientesController),
);

/**
 * @openapi
 * /pacientes/{id}:
 *   delete:
 *     summary: Elimina (desactiva) un paciente
 *     tags: [Pacientes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *           minimum: 1
 *         description: ID del paciente
 *     responses:
 *       204:
 *         description: Paciente eliminado exitosamente
 *       404:
 *         description: Paciente no encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Error interno del servidor
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.delete(
  "/:id",
  authenticate,
  deletePacienteValidator,
  handleValidationErrors,
  pacientesController.delete.bind(pacientesController),
);

export default router;
