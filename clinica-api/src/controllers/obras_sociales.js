import { obraSocialCreate, obraSocialResponse } from "../dtos/obras_sociales.dto.js";
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

  async delete(req, res) {
    try {
      const { id } = req.params;
      const deleted = await obrasSocialesService.delete(id);

      if (deleted === null) {
        return res.status(404).json({ success: false, message: "Obra social no encontrada" });
      }
      if (!deleted) {
        return res.status(500).json({ success: false, message: "Error al eliminar la obra social" });
      }

      return res.status(204).send();
    } catch (err) {
      return res.status(500).json({ success: false, error: err.message });
    }
  }

  async update(req, res) {
    try {
      const { id } = req.params;
      const datos = obraSocialCreate(req.body);
      const actualizada = await obrasSocialesService.update(id, datos);

      if (!actualizada) {
        return res.status(404).json({ success: false, message: "Obra social no encontrada" });
      }

      return res.status(200).json({
        success: true,
        message: "Obra social modificada exitosamente",
        data: obraSocialResponse(actualizada),
      });
    } catch (err) {
      if (err.message.includes("ya está registrado")) {
        return res.status(409).json({ success: false, message: err.message });
      }
      return res.status(500).json({ success: false, error: err.message });
    }
  }

  async create(req, res) {
    try {
      const datos = obraSocialCreate(req.body);
      const nueva = await obrasSocialesService.create(datos);
      return res.status(201).json({
        success: true,
        message: "Obra social creada exitosamente",
        data: obraSocialResponse(nueva),
      });
    } catch (err) {
      if (err.message.includes("ya está registrado")) {
        return res.status(409).json({ success: false, message: err.message });
      }
      return res.status(500).json({ success: false, error: err.message });
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
