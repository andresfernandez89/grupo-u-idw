import { DuplicateError } from "../utils/errors.js";
import {
  especialidadesCreate,
  especialidadesResponse,
} from "../dtos/especialidades.dto.js";

import especialidadService from "../services/especialidades.js";

export class EspecialidadesController {
  async browse(req, res) {
    try {
      const filters = {};
      const page = parseInt(req.query.page) || 1;
      const limit = Math.min(parseInt(req.query.limit) || 10, 100);
      const sort = req.query.sort;
      const order = req.query.order;

      if (req.query.nombre) filters.nombre = req.query.nombre;

      const resultado = await especialidadService.browse({
        filters,
        sort,
        order,
        page,
        limit,
      });

      res.json({
        success: true,
        data: resultado.data.map(especialidadesResponse),
        pagination: resultado.pagination,
      });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }

  async findById(req, res) {
    try {
      const { id } = req.params;
      const especialidadEncontrada = await especialidadService.readById(id);

      if (!especialidadEncontrada) {
        return res.status(404).json({
          message: "No se encontro especialidad con el id solicitado",
        });
      }
      res.json(especialidadesResponse(especialidadEncontrada));
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  async create(req, res) {
    try {
      const datos = especialidadesCreate(req.body);
      const nuevaEspecialidad = await especialidadService.create(datos.nombre);

      return res.status(201).json({
        success: true,
        message: "Especialidad creada exitosamente",
        data: especialidadesResponse(nuevaEspecialidad),
      });
    } catch (error) {
      if (error instanceof DuplicateError) {
        return res.status(409).json({ success: false, message: error.message });
      }

      return res.status(500).json({
        success: false,
        error: error.message,
      });
    }
  }

  async update(req, res) {
    try {
      const { id } = req.params;
      const datos = especialidadesCreate(req.body);
      const actualizada = await especialidadService.update(id, datos);

      if (!actualizada) {
        return res.status(404).json({
          success: false,
          message: "Especialidad no encontrada",
        });
      }

      return res.status(200).json({
        success: true,
        message: "Especialidad modificada exitosamente",
        data: especialidadesResponse(actualizada),
      });
    } catch (err) {
      if (err instanceof DuplicateError) {
        return res.status(409).json({ success: false, message: err.message });
      }

      return res.status(500).json({
        success: false,
        error: err.message,
      });
    }
  }

  async delete(req, res) {
    try {
      const { id } = req.params;
      const deleted = await especialidadService.delete(id);

      if (deleted === null) {
        return res
          .status(404)
          .json({ success: false, message: "Especialidad no encontrada" });
      }

      if (!deleted) {
        return res.status(500).json({
          success: false,
          message: "Error al eliminar la especialidad",
        });
      }

      return res.status(204).send();
    } catch (error) {
      return res.status(500).json({
        success: false,
        error: error.message,
      });
    }
  }
}

export default new EspecialidadesController();
