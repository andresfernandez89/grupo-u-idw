import { Router } from "express";
import { authenticate } from "../../middlewares/auth.js";
import { authorize } from "../../middlewares/role.js";
import obrasSocialesController from "../../controllers/obras_sociales.js";
import { handleValidationErrors } from "../../middlewares/validacion.js";
import {
  browseObraSocialValidator,
  createObraSocialValidator,
  deleteObraSocialValidator,
  getByIdObraSocialValidator,
  getMedicosObraSocialValidator,
  updateObraSocialValidator,
} from "../../validators/obras_sociales.js";

const router = Router();

/**
 * @openapi
 * /obras-sociales:
 *   get:
 *     summary: Obtiene la lista de obras sociales con paginación y filtros
 *     tags: [Obras Sociales]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: nombre
 *         schema:
 *           type: string
 *           maxLength: 120
 *         required: false
 *         description: Filtrar por nombre exacto
 *       - in: query
 *         name: es_particular
 *         schema:
 *           type: integer
 *           enum: [0, 1]
 *         required: false
 *         description: Filtrar por tipo de cobertura
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
 *           enum: [id_obra_social, nombre, porcentaje_descuento]
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
 *         description: Lista paginada de obras sociales
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
 *                     $ref: '#/components/schemas/ObraSocial'
 *                 pagination:
 *                   $ref: '#/components/schemas/Paginacion'
 *       400:
 *         description: Parámetros de consulta inválidos
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
  "/",
  authenticate,
  authorize(3),
  browseObraSocialValidator,
  handleValidationErrors,
  obrasSocialesController.browse.bind(obrasSocialesController),
);

/**
 * @openapi
 * /obras-sociales:
 *   post:
 *     summary: Crea una nueva obra social
 *     tags: [Obras Sociales]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ObraSocialInput'
 *     responses:
 *       201:
 *         description: Obra social creada exitosamente
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
 *                   $ref: '#/components/schemas/ObraSocial'
 *       400:
 *         description: Datos del cuerpo inválidos
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       409:
 *         description: Conflicto (obra social ya registrada)
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
  createObraSocialValidator,
  handleValidationErrors,
  obrasSocialesController.create.bind(obrasSocialesController),
);

/**
 * @openapi
 * /obras-sociales/{id}:
 *   delete:
 *     summary: Elimina (desactiva) una obra social
 *     tags: [Obras Sociales]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *           minimum: 1
 *         description: ID de la obra social
 *     responses:
 *       204:
 *         description: Obra social eliminada exitosamente
 *       400:
 *         description: ID inválido
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Obra social no encontrada
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
  deleteObraSocialValidator,
  handleValidationErrors,
  obrasSocialesController.delete.bind(obrasSocialesController),
);

/**
 * @openapi
 * /obras-sociales/{id}:
 *   put:
 *     summary: Actualiza una obra social existente
 *     tags: [Obras Sociales]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *           minimum: 1
 *         description: ID de la obra social
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ObraSocialInput'
 *     responses:
 *       200:
 *         description: Obra social modificada exitosamente
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
 *                   $ref: '#/components/schemas/ObraSocial'
 *       400:
 *         description: ID o datos del cuerpo inválidos
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Obra social no encontrada
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
  authenticate,
  authorize(3),
  updateObraSocialValidator,
  handleValidationErrors,
  obrasSocialesController.update.bind(obrasSocialesController),
);

/**
 * @openapi
 * /obras-sociales/{id}:
 *   get:
 *     summary: Obtiene una obra social por su ID
 *     tags: [Obras Sociales]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *           minimum: 1
 *         description: ID de la obra social
 *     responses:
 *       200:
 *         description: Obra social encontrada
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/ObraSocial'
 *       400:
 *         description: ID inválido
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Obra social no encontrada
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
/**
 * @openapi
 * /obras-sociales/{id}/medicos:
 *   get:
 *     summary: Obtiene los médicos asociados a una obra social
 *     tags: [Obras Sociales]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *           minimum: 1
 *         description: ID de la obra social
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 1
 *         required: false
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *           default: 10
 *         required: false
 *       - in: query
 *         name: sort
 *         schema:
 *           type: string
 *           enum: [id_medico_obra_social, id_medico, id_obra_social]
 *         required: false
 *       - in: query
 *         name: order
 *         schema:
 *           type: string
 *           enum: [asc, desc]
 *         required: false
 *     responses:
 *       200:
 *         description: Lista paginada de médicos de la obra social
 *       404:
 *         description: Obra social no encontrada
 *       500:
 *         description: Error interno del servidor
 */
router.get(
  "/:id/medicos",
  authenticate,
  authorize(2, 3),
  getMedicosObraSocialValidator,
  handleValidationErrors,
  obrasSocialesController.findMedicos.bind(obrasSocialesController),
);

router.get(
  "/:id",
  authenticate,
  authorize(3),
  getByIdObraSocialValidator,
  handleValidationErrors,
  obrasSocialesController.findById.bind(obrasSocialesController),
);

export default router;
