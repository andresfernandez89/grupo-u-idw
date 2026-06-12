import { Router } from "express";
import { authenticate } from "../../middlewares/auth.js";
import turnosController from "../../controllers/turnos.js";
import { handleValidationErrors } from "../../middlewares/validacion.js";
import {
  browseTurnoValidator,
  createTurnoValidator,
  deleteTurnoValidator,
  getByIdTurnoValidator,
  marcarAtendidoValidator,
  updateTurnoValidator,
} from "../../validators/turnos.js";

const router = Router();

/**
 * @openapi
 * /turnos:
 *   get:
 *     summary: Obtiene la lista de turnos con paginación y filtros
 *     tags: [Turnos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: id_medico
 *         schema:
 *           type: integer
 *           minimum: 1
 *         required: false
 *         description: Filtrar por ID del médico
 *       - in: query
 *         name: id_paciente
 *         schema:
 *           type: integer
 *           minimum: 1
 *         required: false
 *         description: Filtrar por ID del paciente
 *       - in: query
 *         name: id_obra_social
 *         schema:
 *           type: integer
 *           minimum: 1
 *         required: false
 *         description: Filtrar por ID de obra social
 *       - in: query
  *         name: atendido
  *         schema:
  *           type: integer
  *           enum: [0, 1]
  *         required: false
  *         description: Filtrar por estado de atención (0 = no atendido, 1 = atendido)
 *       - in: query
 *         name: fecha_desde
 *         schema:
 *           type: string
 *           format: date-time
 *         required: false
 *         description: Filtrar desde esta fecha (ISO 8601)
 *       - in: query
 *         name: fecha_hasta
 *         schema:
 *           type: string
 *           format: date-time
 *         required: false
 *         description: Filtrar hasta esta fecha (ISO 8601)
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
  *           enum: [id_turno_reserva, fecha_hora, valor_total, atendido, id_medico, id_paciente]
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
 *         description: Lista paginada de turnos
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
 *                     $ref: '#/components/schemas/Turno'
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
  browseTurnoValidator,
  handleValidationErrors,
  turnosController.browse.bind(turnosController),
);

/**
 * @openapi
 * /turnos/{id}:
 *   get:
 *     summary: Obtiene un turno por su ID
 *     tags: [Turnos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *           minimum: 1
 *         description: ID del turno
 *     responses:
 *       200:
 *         description: Turno encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Turno'
 *       404:
 *         description: Turno no encontrado
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
  getByIdTurnoValidator,
  handleValidationErrors,
  turnosController.findById.bind(turnosController),
);

/**
 * @openapi
 * /turnos:
 *   post:
 *     summary: Crea un nuevo turno
 *     tags: [Turnos]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/TurnoCreate'
 *     responses:
 *       201:
 *         description: Turno creado exitosamente
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
 *                   $ref: '#/components/schemas/Turno'
 *       400:
 *         description: Error de validación (médico, paciente u obra social inexistente/inactivo)
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       409:
 *         description: Conflicto (médico ya tiene un turno en esa fecha y hora)
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
  createTurnoValidator,
  handleValidationErrors,
  turnosController.create.bind(turnosController),
);

/**
 * @openapi
 * /turnos/{id}:
 *   put:
 *     summary: Actualiza un turno existente
 *     tags: [Turnos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *           minimum: 1
 *         description: ID del turno
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/TurnoCreate'
 *     responses:
 *       200:
 *         description: Turno modificado exitosamente
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
 *                   $ref: '#/components/schemas/Turno'
 *       400:
 *         description: Error de validación (médico, paciente u obra social inexistente/inactivo)
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Turno no encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       409:
 *         description: Conflicto (médico ya tiene un turno en esa fecha y hora)
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
  updateTurnoValidator,
  handleValidationErrors,
  turnosController.update.bind(turnosController),
);

/**
 * @openapi
  * /turnos/{id}/atendido:
 *   patch:
 *     summary: Marca un turno como atendido
 *     tags: [Turnos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *           minimum: 1
 *         description: ID del turno
 *     responses:
 *       200:
  *         description: Turno marcado como atendido
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
 *                   $ref: '#/components/schemas/Turno'
 *       404:
 *         description: Turno no encontrado
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
router.patch(
  "/:id/atendido",
  authenticate,
  marcarAtendidoValidator,
  handleValidationErrors,
  turnosController.marcarAtendido.bind(turnosController),
);

/**
 * @openapi
 * /turnos/{id}:
 *   delete:
 *     summary: Elimina (desactiva) un turno
 *     tags: [Turnos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *           minimum: 1
 *         description: ID del turno
 *     responses:
 *       204:
 *         description: Turno eliminado exitosamente
 *       404:
 *         description: Turno no encontrado
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
  deleteTurnoValidator,
  handleValidationErrors,
  turnosController.delete.bind(turnosController),
);

export default router;
