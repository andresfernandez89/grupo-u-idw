import {
  estadisticaObraSocialResponse,
  estadisticaPorMedicoResponse,
  estadisticaPorEspecialidadResponse,
  resumenGeneralTurnosResponse,
} from "../dtos/estadisticas.dto.js";
import estadisticasService from "../services/estadisticas.js";
import { generarPdf, fmt } from "../utils/pdf.js";

export class EstadisticasController {
  async porObraSocial(req, res) {
    try {
      const { fecha_desde, fecha_hasta } = req.query;
      const rows = await estadisticasService.porObraSocial({
        fecha_desde,
        fecha_hasta,
      });
      res.json({
        success: true,
        data: rows.map(estadisticaObraSocialResponse),
      });
    } catch (err) {
      res.status(500).json({ success: false, message: err.message });
    }
  }

  async porMedico(req, res) {
    try {
      const { fecha_desde, fecha_hasta } = req.query;
      const rows = await estadisticasService.porMedico({
        fecha_desde,
        fecha_hasta,
      });
      res.json({ success: true, data: rows.map(estadisticaPorMedicoResponse) });
    } catch (err) {
      res.status(500).json({ success: false, message: err.message });
    }
  }

  async porEspecialidad(req, res) {
    try {
      const { fecha_desde, fecha_hasta } = req.query;
      const rows = await estadisticasService.porEspecialidad({
        fecha_desde,
        fecha_hasta,
      });
      res.json({
        success: true,
        data: rows.map(estadisticaPorEspecialidadResponse),
      });
    } catch (err) {
      res.status(500).json({ success: false, message: err.message });
    }
  }

  async resumenGeneral(req, res) {
    try {
      const { fecha_desde, fecha_hasta } = req.query;
      const row = await estadisticasService.resumenGeneral({
        fecha_desde,
        fecha_hasta,
      });
      res.json({ success: true, data: resumenGeneralTurnosResponse(row) });
    } catch (err) {
      res.status(500).json({ success: false, message: err.message });
    }
  }

  async porObraSocialPdf(req, res) {
    try {
      const { fecha_desde, fecha_hasta } = req.query;
      const rows = await estadisticasService.porObraSocial({
        fecha_desde,
        fecha_hasta,
      });
      const filas = rows.map((r) => ({
        obra_social: r.obra_social,
        es_particular: fmt.bool(r.es_particular),
        total_turnos: r.total_turnos,
        turnos_atendidos: r.turnos_atendidos,
        turnos_pendientes: r.turnos_pendientes,
        ingresos_realizados: fmt.dinero(r.ingresos_realizados),
        porcentaje_atencion: fmt.pct(r.porcentaje_atencion),
      }));
      generarPdf(res, {
        titulo: "Estadísticas por Obra Social",
        filename: "estadisticas-obra-social.pdf",
        fechaDesde: fecha_desde,
        fechaHasta: fecha_hasta,
        landscape: true,
        columnas: [
          { titulo: "Obra Social", clave: "obra_social", ancho: 170 },
          { titulo: "Particular", clave: "es_particular", ancho: 65 },
          { titulo: "Total", clave: "total_turnos", ancho: 75, align: "right" },
          {
            titulo: "Atendidos",
            clave: "turnos_atendidos",
            ancho: 75,
            align: "right",
          },
          {
            titulo: "Pendientes",
            clave: "turnos_pendientes",
            ancho: 75,
            align: "right",
          },
          {
            titulo: "Ingresos",
            clave: "ingresos_realizados",
            ancho: 120,
            align: "right",
          },
          {
            titulo: "% Atención",
            clave: "porcentaje_atencion",
            ancho: 80,
            align: "right",
          },
        ],
        filas,
      });
    } catch (err) {
      if (!res.headersSent) res.status(500).json({ success: false, message: err.message });
    }
  }

  async porMedicoPdf(req, res) {
    try {
      const { fecha_desde, fecha_hasta } = req.query;
      const rows = await estadisticasService.porMedico({
        fecha_desde,
        fecha_hasta,
      });
      const filas = rows.map((r) => ({
        medico: r.medico,
        especialidad: r.especialidad,
        total_turnos: r.total_turnos,
        turnos_atendidos: r.turnos_atendidos,
        turnos_pendientes: r.turnos_pendientes,
        ingresos_realizados: fmt.dinero(r.ingresos_realizados),
        porcentaje_atencion: fmt.pct(r.porcentaje_atencion),
      }));
      generarPdf(res, {
        titulo: "Estadísticas por Médico",
        filename: "estadisticas-medico.pdf",
        fechaDesde: fecha_desde,
        fechaHasta: fecha_hasta,
        landscape: true,
        columnas: [
          { titulo: "Médico", clave: "medico", ancho: 170 },
          { titulo: "Especialidad", clave: "especialidad", ancho: 125 },
          { titulo: "Total", clave: "total_turnos", ancho: 70, align: "right" },
          {
            titulo: "Atendidos",
            clave: "turnos_atendidos",
            ancho: 75,
            align: "right",
          },
          {
            titulo: "Pendientes",
            clave: "turnos_pendientes",
            ancho: 75,
            align: "right",
          },
          {
            titulo: "Ingresos",
            clave: "ingresos_realizados",
            ancho: 120,
            align: "right",
          },
          {
            titulo: "% Atención",
            clave: "porcentaje_atencion",
            ancho: 80,
            align: "right",
          },
        ],
        filas,
      });
    } catch (err) {
      if (!res.headersSent) res.status(500).json({ success: false, message: err.message });
    }
  }

  async porEspecialidadPdf(req, res) {
    try {
      const { fecha_desde, fecha_hasta } = req.query;
      const rows = await estadisticasService.porEspecialidad({
        fecha_desde,
        fecha_hasta,
      });
      const filas = rows.map((r) => ({
        especialidad: r.especialidad,
        total_medicos: r.total_medicos,
        total_turnos: r.total_turnos,
        turnos_atendidos: r.turnos_atendidos,
        turnos_pendientes: r.turnos_pendientes,
        ingresos_realizados: fmt.dinero(r.ingresos_realizados),
        porcentaje_atencion: fmt.pct(r.porcentaje_atencion),
      }));
      generarPdf(res, {
        titulo: "Estadísticas por Especialidad",
        filename: "estadisticas-especialidad.pdf",
        fechaDesde: fecha_desde,
        fechaHasta: fecha_hasta,
        landscape: true,
        columnas: [
          { titulo: "Especialidad", clave: "especialidad", ancho: 170 },
          {
            titulo: "Médicos",
            clave: "total_medicos",
            ancho: 65,
            align: "right",
          },
          { titulo: "Total", clave: "total_turnos", ancho: 75, align: "right" },
          {
            titulo: "Atendidos",
            clave: "turnos_atendidos",
            ancho: 75,
            align: "right",
          },
          {
            titulo: "Pendientes",
            clave: "turnos_pendientes",
            ancho: 75,
            align: "right",
          },
          {
            titulo: "Ingresos",
            clave: "ingresos_realizados",
            ancho: 120,
            align: "right",
          },
          {
            titulo: "% Atención",
            clave: "porcentaje_atencion",
            ancho: 80,
            align: "right",
          },
        ],
        filas,
      });
    } catch (err) {
      if (!res.headersSent) res.status(500).json({ success: false, message: err.message });
    }
  }

  async resumenGeneralPdf(req, res) {
    try {
      const { fecha_desde, fecha_hasta } = req.query;
      const row = await estadisticasService.resumenGeneral({
        fecha_desde,
        fecha_hasta,
      });
      const data = resumenGeneralTurnosResponse(row);
      const filas = [
        { indicador: "Total de Turnos", valor: data.total_turnos },
        { indicador: "Turnos Atendidos", valor: data.turnos_atendidos },
        { indicador: "Turnos Pendientes", valor: data.turnos_pendientes },
        {
          indicador: "Ingresos Realizados",
          valor: fmt.dinero(data.ingresos_realizados),
        },
        {
          indicador: "Porcentaje de Atención",
          valor: fmt.pct(data.porcentaje_atencion),
        },
        { indicador: "Pacientes con Turnos", valor: data.total_pacientes },
        { indicador: "Médicos con Actividad", valor: data.total_medicos },
        {
          indicador: "Obras Sociales con Turnos",
          valor: data.total_obras_sociales,
        },
      ];
      generarPdf(res, {
        titulo: "Resumen General de Turnos",
        filename: "estadisticas-resumen-general.pdf",
        fechaDesde: fecha_desde,
        fechaHasta: fecha_hasta,
        landscape: true,
        columnas: [
          { titulo: "Indicador", clave: "indicador", ancho: 450 },
          { titulo: "Valor", clave: "valor", ancho: 290, align: "right" },
        ],
        filas,
      });
    } catch (err) {
      if (!res.headersSent) res.status(500).json({ success: false, message: err.message });
    }
  }
}

export default new EstadisticasController();
