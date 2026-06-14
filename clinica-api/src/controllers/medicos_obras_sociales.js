import { medicoObraSocialCreate, medicoObraSocialResponse } from "../dtos/medicos_obras_sociales.dto.js";
import medicosObrasSocialesService from "../services/medicos_obras_sociales.js";

export class MedicosObrasSocialesController {
  async browse(req, res) {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = Math.min(parseInt(req.query.limit) || 10, 100);
      const sort = req.query.sort;
      const order = req.query.order;

      const filters = {};
      if (req.query.id_medico) filters.id_medico = req.query.id_medico;
      if (req.query.id_obra_social) filters.id_obra_social = req.query.id_obra_social;

      const resultado = await medicosObrasSocialesService.browse({ filters, sort, order, page, limit });

      res.json({
        success: true,
        data: resultado.data.map(medicoObraSocialResponse),
        pagination: resultado.pagination,
      });
    } catch (err) {
      res.status(500).json({ success: false, message: err.message });
    }
  }

  async findById(req, res) {
    try {
      const { id } = req.params;
      const mos = await medicosObrasSocialesService.readById(id);

      if (!mos) {
        return res.status(404).json({
          success: false,
          message: "No se encontró la relación médico-obra social con el id solicitado",
        });
      }

      res.json(medicoObraSocialResponse(mos));
    } catch (err) {
      res.status(500).json({ success: false, message: err.message });
    }
  }

  async create(req, res) {
    try {
      const datos = medicoObraSocialCreate(req.body);
      const nuevo = await medicosObrasSocialesService.create(datos);
      const creado = await medicosObrasSocialesService.readById(nuevo.id_medico_obra_social);

      return res.status(201).json({
        success: true,
        message: "Relación médico-obra social creada exitosamente",
        data: medicoObraSocialResponse(creado),
      });
    } catch (err) {
      if (err.message.includes("ya tiene asignada")) {
        return res.status(409).json({ success: false, message: err.message });
      }

      return res.status(500).json({ success: false, message: err.message });
    }
  }

  async delete(req, res) {
    try {
      const { id_medico, id_obra_social } = req.params;
      const deleted = await medicosObrasSocialesService.delete(id_medico, id_obra_social);

      if (deleted === null) {
        return res.status(404).json({ success: false, message: "Relación médico-obra social no encontrada" });
      }

      if (!deleted) {
        return res.status(500).json({ success: false, message: "Error al eliminar la relación médico-obra social" });
      }

      return res.status(204).send();
    } catch (err) {
      return res.status(500).json({ success: false, message: err.message });
    }
  }
}

export default new MedicosObrasSocialesController();
