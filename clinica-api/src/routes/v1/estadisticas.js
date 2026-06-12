import { Router } from "express";
import estadisticasController from "../../controllers/estadisticas.js";
import { handleValidationErrors } from "../../middlewares/validacion.js";
import { porObraSocialValidator } from "../../validators/estadisticas.js";

const router = Router();

/**
 * @openapi
 * /estadisticas/por-obra-social:
 *   get:
 *     summary: Estadísticas de atenciones agrupadas por obra social (solo administradores)
 *     tags: [Estadísticas]
 *     parameters:
 *       - in: query
 *         name: fecha_desde
 *         schema:
 *           type: string
 *           format: date-time
 *         required: false
 *         description: Filtrar desde esta fecha (ISO 8601). Opcional.
 *       - in: query
 *         name: fecha_hasta
 *         schema:
 *           type: string
 *           format: date-time
 *         required: false
 *         description: Filtrar hasta esta fecha (ISO 8601). Opcional.
 *     responses:
 *       200:
 *         description: Estadísticas por obra social calculadas mediante stored procedure
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
 *                     $ref: '#/components/schemas/EstadisticaPorObraSocial'
 *       400:
 *         description: Parámetros de fecha inválidos
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
  "/por-obra-social",
  porObraSocialValidator,
  handleValidationErrors,
  estadisticasController.porObraSocial.bind(estadisticasController),
);

export default router;
