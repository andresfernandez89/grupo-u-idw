import { obraSocialResponse } from "../dtos/obras_sociales.dto.js";
import obrasSocialesService from "../services/obras_sociales.js";

export class ObrasSocialesController {
  async browse(req, res) {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = Math.min(parseInt(req.query.limit) || 10, 100);
      const sort = req.query.sort;
      const order = req.query.order;

      const filters = {};
      if (req.query.nombre) filters.nombre = req.query.nombre;
      if (req.query.es_particular !== undefined) filters.es_particular = req.query.es_particular;

      const resultado = await obrasSocialesService.browse({ filters, sort, order, page, limit });

      res.json({
        success: true,
        data: resultado.data.map(obraSocialResponse),
        pagination: resultado.pagination,
      });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }

  async findById(req, res) {
    try {
      const { id } = req.params;
      const obraSocial = await obrasSocialesService.readById(id);

      if (!obraSocial) {
        return res.status(404).json({
          message: "No se encontró obra social con el id solicitado",
        });
      }

      res.json(obraSocialResponse(obraSocial));
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }
}

export default new ObrasSocialesController();
