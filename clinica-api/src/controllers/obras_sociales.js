import { DuplicateError, NotFoundError } from "../utils/errors.js";
import {
  obraSocialCreate,
  obraSocialResponse,
} from "../dtos/obras_sociales.dto.js";
import { medicoObraSocialResponse } from "../dtos/medicos_obras_sociales.dto.js";
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
      if (req.query.es_particular !== undefined)
        filters.es_particular = req.query.es_particular;

      const resultado = await obrasSocialesService.browse({
        filters,
        sort,
        order,
        page,
        limit,
      });

      res.json({
        success: true,
        data: resultado.data.map(obraSocialResponse),
        pagination: resultado.pagination,
      });
    } catch (err) {
      res.status(500).json({ success: false, message: err.message });
    }
  }

  async delete(req, res) {
    try {
      const { id } = req.params;
      const deleted = await obrasSocialesService.delete(id);

      if (!deleted) {
        return res.status(500).json({
          success: false,
          message: "Error al eliminar la obra social",
        });
      }

      return res.status(204).send();
    } catch (err) {
      if (err instanceof NotFoundError) {
        return res.status(404).json({ success: false, message: err.message });
      }
      return res.status(500).json({ success: false, message: err.message });
    }
  }

  async update(req, res) {
    try {
      const { id } = req.params;
      const datos = obraSocialCreate(req.body);
      const actualizada = await obrasSocialesService.update(id, datos);

      return res.status(200).json({
        success: true,
        message: "Obra social modificada exitosamente",
        data: obraSocialResponse(actualizada),
      });
    } catch (err) {
      if (err instanceof DuplicateError) {
        return res.status(409).json({ success: false, message: err.message });
      }
      if (err instanceof NotFoundError) {
        return res.status(404).json({ success: false, message: err.message });
      }
      return res.status(500).json({ success: false, message: err.message });
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
      if (err instanceof DuplicateError) {
        return res.status(409).json({ success: false, message: err.message });
      }
      return res.status(500).json({ success: false, message: err.message });
    }
  }

  async findMedicos(req, res) {
    try {
      const { id } = req.params;
      const page = parseInt(req.query.page) || 1;
      const limit = Math.min(parseInt(req.query.limit) || 10, 100);
      const sort = req.query.sort;
      const order = req.query.order;

      const resultado = await obrasSocialesService.getMedicos(id, {
        page,
        limit,
        sort,
        order,
      });

      const data = resultado.data.map(medicoObraSocialResponse);

      res.json({
        success: true,
        message:
          data.length === 0
            ? "La obra social solicitada no tiene médicos asignados"
            : undefined,
        data,
        pagination: resultado.pagination,
      });
    } catch (error) {
      if (error instanceof NotFoundError) {
        return res.status(404).json({ success: false, message: error.message });
      }
      res.status(500).json({ success: false, message: error.message });
    }
  }

  async findById(req, res) {
    try {
      const { id } = req.params;
      const obraSocial = await obrasSocialesService.readById(id);

      res.json({ success: true, data: obraSocialResponse(obraSocial) });
    } catch (err) {
      if (err instanceof NotFoundError) {
        return res.status(404).json({ success: false, message: err.message });
      }
      res.status(500).json({ success: false, message: err.message });
    }
  }
}

export default new ObrasSocialesController();
