import { estadisticaObraSocialResponse } from "../dtos/estadisticas.dto.js";
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
}

export default new EstadisticasController();
