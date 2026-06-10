import { Router } from "express";
import { cache } from "../../config/cache.js";
import especialidadController from "../../controllers/especialidades.js";
import { handleValidationErrors } from "../../middlewares/validacion.js";
import {
  browseEspecialidadValidator,
  createEspecialidadValidator,
  deleteEspecialidadValidator,
  getByIdEspecialidadValidator,
  updateEspecialidadValidator,
} from "../../validators/especialidades.js";

const router = Router();

/**
 * @openapi
 * /especialidades:
 *   get:
 *     summary: Obtiene la lista de especialidades con paginación y filtros
 *     tags: [Especialidades]
 *     parameters:
 *       - in: query
 *         name: nombre
 *         schema:
 *           type: string
 *           maxLength: 120
 *         required: false
 *         description: Filtrar por nombre exacto
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
 *           enum: [id_especialidad, nombre]
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
 *         description: Lista paginada de especialidades
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
 *                     $ref: '#/components/schemas/Especialidad'
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
  cache("5 minutes"),
  browseEspecialidadValidator,
  handleValidationErrors,
  especialidadController.browse.bind(especialidadController),
);

/**
 * @openapi
 * /especialidades/{id}:
 *   get:
 *     summary: Obtiene una especialidad por su ID
 *     tags: [Especialidades]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *           minimum: 1
 *         description: ID de la especialidad
 *     responses:
 *       200:
 *         description: Especialidad encontrada
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Especialidad'
 *       404:
 *         description: Especialidad no encontrada
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
  cache("5 minutes"),
  getByIdEspecialidadValidator,
  handleValidationErrors,
  especialidadController.findById.bind(especialidadController),
);

/**
 * @openapi
 * /especialidades:
 *   post:
 *     summary: Crea una nueva especialidad
 *     tags: [Especialidades]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/EspecialidadCreate'
 *     responses:
 *       201:
 *         description: Especialidad creada exitosamente
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
 *                   $ref: '#/components/schemas/Especialidad'
 *       409:
 *         description: Conflicto (especialidad ya registrada)
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
  createEspecialidadValidator,
  handleValidationErrors,
  especialidadController.create.bind(especialidadController),
);

/**
 * @openapi
 * /especialidades/{id}:
 *   put:
 *     summary: Actualiza una especialidad existente
 *     tags: [Especialidades]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *           minimum: 1
 *         description: ID de la especialidad
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/EspecialidadCreate'
 *     responses:
 *       200:
 *         description: Especialidad modificada exitosamente
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
 *                   $ref: '#/components/schemas/Especialidad'
 *       404:
 *         description: Especialidad no encontrada
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       409:
 *         description: Conflicto (nombre ya está registrado)
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
  updateEspecialidadValidator,
  handleValidationErrors,
  especialidadController.update.bind(especialidadController),
);

/**
 * @openapi
 * /especialidades/{id}:
 *   delete:
 *     summary: Elimina (desactiva) una especialidad
 *     tags: [Especialidades]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *           minimum: 1
 *         description: ID de la especialidad
 *     responses:
 *       204:
 *         description: Especialidad eliminada exitosamente
 *       404:
 *         description: Especialidad no encontrada
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
  deleteEspecialidadValidator,
  handleValidationErrors,
  especialidadController.delete.bind(especialidadController),
);

export default router;
