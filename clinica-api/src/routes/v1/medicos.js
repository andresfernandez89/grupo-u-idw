import { Router } from "express";
import { authenticate } from "../../middlewares/auth.js";
import { authorize } from "../../middlewares/role.js";
import medicoController from "../../controllers/medicos.js";
import { handleValidationErrors } from "../../middlewares/validacion.js";
import {
  browseMedicoValidator,
  createMedicoValidator,
  deleteMedicoValidator,
  getByEspecialidadMedicoValidator,
  getByIdMedicoValidator,
  updateMedicoValidator,
} from "../../validators/medicos.js";

const router = Router();

/**
 * @openapi
 * /medicos:
 *   get:
 *     summary: Obtiene la lista de médicos con paginación y filtros
 *     tags: [Médicos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: id_especialidad
 *         schema:
 *           type: integer
 *           minimum: 1
 *         required: false
 *         description: Filtrar por ID de especialidad
 *       - in: query
 *         name: matricula
 *         schema:
 *           type: integer
 *           minimum: 1
 *         required: false
 *         description: Filtrar por número de matrícula
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
 *           enum: [id_medico, matricula, valor_consulta, apellido, nombres]
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
 *         description: Lista paginada de médicos
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
 *                     $ref: '#/components/schemas/Medico'
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
  authorize(2, 3),
  browseMedicoValidator,
  handleValidationErrors,
  medicoController.browse.bind(medicoController),
);

/**
 * @openapi
 * /medicos/especialidad/{id_especialidad}:
 *   get:
 *     summary: Obtiene médicos filtrados por especialidad
 *     tags: [Médicos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id_especialidad
 *         required: true
 *         schema:
 *           type: integer
 *           minimum: 1
 *         description: ID de la especialidad
 *       - in: query
 *         name: matricula
 *         schema:
 *           type: integer
 *           minimum: 1
 *         required: false
 *         description: Filtrar por número de matrícula
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
 *           enum: [id_medico, matricula, valor_consulta, apellido, nombres]
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
 *         description: Lista paginada de médicos de la especialidad
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
 *                     $ref: '#/components/schemas/Medico'
 *                 pagination:
 *                   $ref: '#/components/schemas/Paginacion'
 *       404:
 *         description: No se encontraron médicos para la especialidad solicitada
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
  "/especialidad/:id_especialidad",
  authenticate,
  authorize(2, 3),
  getByEspecialidadMedicoValidator,
  handleValidationErrors,
  medicoController.findByEspecialidad.bind(medicoController),
);

/**
 * @openapi
 * /medicos/{id}:
 *   get:
 *     summary: Obtiene un médico por su ID
 *     tags: [Médicos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *           minimum: 1
 *         description: ID del médico
 *     responses:
 *       200:
 *         description: Médico encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Medico'
 *       404:
 *         description: Médico no encontrado
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
  authorize(2, 3),
  getByIdMedicoValidator,
  handleValidationErrors,
  medicoController.findById.bind(medicoController),
);

/**
 * @openapi
 * /medicos:
 *   post:
 *     summary: Crea un nuevo médico
 *     tags: [Médicos]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/MedicoCreate'
 *     responses:
 *       201:
 *         description: Médico creado exitosamente
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
 *                   $ref: '#/components/schemas/Medico'
 *       400:
 *         description: Error de validación (especialidad inactiva)
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       409:
 *         description: Conflicto (matrícula ya está registrada)
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
  authorize(3),
  createMedicoValidator,
  handleValidationErrors,
  medicoController.create.bind(medicoController),
);

/**
 * @openapi
 * /medicos/{id}:
 *   put:
 *     summary: Actualiza un médico existente
 *     tags: [Médicos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *           minimum: 1
 *         description: ID del médico
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/MedicoCreate'
 *     responses:
 *       200:
 *         description: Médico modificado exitosamente
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
 *                   $ref: '#/components/schemas/Medico'
 *       400:
 *         description: Error de validación (especialidad inactiva)
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Médico no encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       409:
 *         description: Conflicto (matrícula ya está registrada)
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
  authorize(3),
  updateMedicoValidator,
  handleValidationErrors,
  medicoController.update.bind(medicoController),
);

/**
 * @openapi
 * /medicos/{id}:
 *   delete:
 *     summary: Elimina (desactiva) un médico
 *     tags: [Médicos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *           minimum: 1
 *         description: ID del médico
 *     responses:
 *       204:
 *         description: Médico eliminado exitosamente
 *       404:
 *         description: Médico no encontrado
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
  authorize(3),
  deleteMedicoValidator,
  handleValidationErrors,
  medicoController.delete.bind(medicoController),
);

export default router;
