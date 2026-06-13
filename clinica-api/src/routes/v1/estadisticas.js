import { Router } from "express";
import estadisticasController from "../../controllers/estadisticas.js";
import { handleValidationErrors } from "../../middlewares/validacion.js";
import {
  porObraSocialValidator,
  porMedicoValidator,
  porEspecialidadValidator,
  resumenGeneralValidator,
} from "../../validators/estadisticas.js";

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

/**
 * @openapi
 * /estadisticas/por-medico:
 *   get:
 *     summary: Estadísticas de atenciones agrupadas por médico (solo administradores)
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
 *         description: Estadísticas por médico calculadas mediante stored procedure
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
 *                     $ref: '#/components/schemas/EstadisticaPorMedico'
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
  "/por-medico",
  porMedicoValidator,
  handleValidationErrors,
  estadisticasController.porMedico.bind(estadisticasController),
);

/**
 * @openapi
 * /estadisticas/por-especialidad:
 *   get:
 *     summary: Estadísticas de atenciones agrupadas por especialidad (solo administradores)
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
 *         description: Estadísticas por especialidad calculadas mediante stored procedure
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
 *                     $ref: '#/components/schemas/EstadisticaPorEspecialidad'
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
  "/por-especialidad",
  porEspecialidadValidator,
  handleValidationErrors,
  estadisticasController.porEspecialidad.bind(estadisticasController),
);

/**
 * @openapi
 * /estadisticas/resumen-general:
 *   get:
 *     summary: Resumen general de turnos con totales globales (solo administradores)
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
 *         description: Resumen general calculado mediante stored procedure
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/ResumenGeneralTurnos'
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
  "/resumen-general",
  resumenGeneralValidator,
  handleValidationErrors,
  estadisticasController.resumenGeneral.bind(estadisticasController),
);

export default router;
