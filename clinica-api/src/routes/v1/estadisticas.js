import { Router } from "express";
import estadisticasController from "../../controllers/estadisticas.js";
import { authenticate } from "../../middlewares/auth.js";
import { authorize } from "../../middlewares/role.js";
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
  authenticate,
  authorize(3),
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
  authenticate,
  authorize(3),
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
  authenticate,
  authorize(3),
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
  authenticate,
  authorize(3),
  resumenGeneralValidator,
  handleValidationErrors,
  estadisticasController.resumenGeneral.bind(estadisticasController),
);

/**
 * @openapi
 * /estadisticas/por-obra-social/pdf:
 *   get:
 *     summary: Descarga PDF con estadísticas por obra social
 *     tags: [Estadísticas]
 *     parameters:
 *       - in: query
 *         name: fecha_desde
 *         schema: { type: string, format: date-time }
 *       - in: query
 *         name: fecha_hasta
 *         schema: { type: string, format: date-time }
 *     responses:
 *       200:
 *         description: Archivo PDF
 *         content:
 *           application/pdf:
 *             schema: { type: string, format: binary }
 *       400:
 *         description: Parámetros de fecha inválidos
 */
router.get(
  "/por-obra-social/pdf",
  authenticate,
  authorize(3),
  porObraSocialValidator,
  handleValidationErrors,
  estadisticasController.porObraSocialPdf.bind(estadisticasController),
);

/**
 * @openapi
 * /estadisticas/por-medico/pdf:
 *   get:
 *     summary: Descarga PDF con estadísticas por médico
 *     tags: [Estadísticas]
 *     parameters:
 *       - in: query
 *         name: fecha_desde
 *         schema: { type: string, format: date-time }
 *       - in: query
 *         name: fecha_hasta
 *         schema: { type: string, format: date-time }
 *     responses:
 *       200:
 *         description: Archivo PDF
 *         content:
 *           application/pdf:
 *             schema: { type: string, format: binary }
 *       400:
 *         description: Parámetros de fecha inválidos
 */
router.get(
  "/por-medico/pdf",
  authenticate,
  authorize(3),
  porMedicoValidator,
  handleValidationErrors,
  estadisticasController.porMedicoPdf.bind(estadisticasController),
);

/**
 * @openapi
 * /estadisticas/por-especialidad/pdf:
 *   get:
 *     summary: Descarga PDF con estadísticas por especialidad
 *     tags: [Estadísticas]
 *     parameters:
 *       - in: query
 *         name: fecha_desde
 *         schema: { type: string, format: date-time }
 *       - in: query
 *         name: fecha_hasta
 *         schema: { type: string, format: date-time }
 *     responses:
 *       200:
 *         description: Archivo PDF
 *         content:
 *           application/pdf:
 *             schema: { type: string, format: binary }
 *       400:
 *         description: Parámetros de fecha inválidos
 */
router.get(
  "/por-especialidad/pdf",
  authenticate,
  authorize(3),
  porEspecialidadValidator,
  handleValidationErrors,
  estadisticasController.porEspecialidadPdf.bind(estadisticasController),
);

/**
 * @openapi
 * /estadisticas/resumen-general/pdf:
 *   get:
 *     summary: Descarga PDF con el resumen general de turnos
 *     tags: [Estadísticas]
 *     parameters:
 *       - in: query
 *         name: fecha_desde
 *         schema: { type: string, format: date-time }
 *       - in: query
 *         name: fecha_hasta
 *         schema: { type: string, format: date-time }
 *     responses:
 *       200:
 *         description: Archivo PDF
 *         content:
 *           application/pdf:
 *             schema: { type: string, format: binary }
 *       400:
 *         description: Parámetros de fecha inválidos
 */
router.get(
  "/resumen-general/pdf",
  authenticate,
  authorize(3),
  resumenGeneralValidator,
  handleValidationErrors,
  estadisticasController.resumenGeneralPdf.bind(estadisticasController),
);

export default router;
