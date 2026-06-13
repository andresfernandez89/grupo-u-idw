import {
  estadisticaObraSocialResponse,
  estadisticaPorMedicoResponse,
  estadisticaPorEspecialidadResponse,
  resumenGeneralTurnosResponse,
} from "../dtos/estadisticas.dto.js";
import estadisticasService from "../services/estadisticas.js";

export class EstadisticasController {
  async porObraSocial(req, res) {
    try {
      const { fecha_desde, fecha_hasta } = req.query;
      const rows = await estadisticasService.porObraSocial({ fecha_desde, fecha_hasta });
      res.json({ success: true, data: rows.map(estadisticaObraSocialResponse) });
    } catch (err) {
      res.status(500).json({ success: false, message: err.message });
    }
  }

  async porMedico(req, res) {
    try {
      const { fecha_desde, fecha_hasta } = req.query;
      const rows = await estadisticasService.porMedico({ fecha_desde, fecha_hasta });
      res.json({ success: true, data: rows.map(estadisticaPorMedicoResponse) });
    } catch (err) {
      res.status(500).json({ success: false, message: err.message });
    }
  }

  async porEspecialidad(req, res) {
    try {
      const { fecha_desde, fecha_hasta } = req.query;
      const rows = await estadisticasService.porEspecialidad({ fecha_desde, fecha_hasta });
      res.json({ success: true, data: rows.map(estadisticaPorEspecialidadResponse) });
    } catch (err) {
      res.status(500).json({ success: false, message: err.message });
    }
  }

  async resumenGeneral(req, res) {
    try {
      const { fecha_desde, fecha_hasta } = req.query;
      const row = await estadisticasService.resumenGeneral({ fecha_desde, fecha_hasta });
      res.json({ success: true, data: resumenGeneralTurnosResponse(row) });
    } catch (err) {
      res.status(500).json({ success: false, message: err.message });
    }
  }
}

export default new EstadisticasController();
