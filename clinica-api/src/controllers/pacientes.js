import { DuplicateError, ForeignKeyError } from "../utils/errors.js";
import { pacienteCreate, pacienteResponse } from "../dtos/pacientes.dto.js";
import pacienteService from "../services/pacientes.js";

export class PacientesController {
  async browse(req, res) {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = Math.min(parseInt(req.query.limit) || 10, 100);
      const sort = req.query.sort;
      const order = req.query.order;

      const filters = {};
      if (req.query.apellido) filters.apellido = req.query.apellido;
      if (req.query.nombres) filters.nombres = req.query.nombres;
      if (req.query.id_obra_social !== undefined) filters.id_obra_social = req.query.id_obra_social;

      const resultado = await pacienteService.browse({
        filters,
        sort,
        order,
        page,
        limit,
      });

      res.json({
        success: true,
        data: resultado.data.map(pacienteResponse),
        pagination: resultado.pagination,
      });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }

  async findById(req, res) {
    try {
      const { id } = req.params;
      const paciente = await pacienteService.readById(id);

      res.json(pacienteResponse(paciente));
    } catch (err) {
      if (err instanceof NotFoundError) {
        return res.status(404).json({ message: err.message });
      }
      res.status(500).json({ message: err.message });
    }
  }

  async create(req, res) {
    try {
      const datos = pacienteCreate(req.body);
      const nuevo = await pacienteService.create(datos);

      return res.status(201).json({
        success: true,
        message: "Paciente creado exitosamente",
        data: pacienteResponse(nuevo),
      });
    } catch (err) {
      if (err instanceof DuplicateError) {
        return res.status(409).json({ success: false, message: err.message });
      }
      if (err instanceof ForeignKeyError) {
        return res.status(400).json({ success: false, message: err.message });
      }
      return res.status(500).json({ success: false, error: err.message });
    }
  }

  async update(req, res) {
    try {
      const { id } = req.params;
      const datos = pacienteCreate(req.body);
      const actualizado = await pacienteService.update(id, datos);

      return res.status(200).json({
        success: true,
        message: "Paciente modificado exitosamente",
        data: pacienteResponse(actualizado),
      });
    } catch (err) {
      if (err instanceof NotFoundError) {
        return res.status(404).json({ success: false, message: err.message });
      }
      if (err instanceof ForeignKeyError) {
        return res.status(400).json({ success: false, message: err.message });
      }
      return res.status(500).json({ success: false, error: err.message });
    }
  }

  async delete(req, res) {
    try {
      const { id } = req.params;
      const deleted = await pacienteService.delete(id);

      if (!deleted) {
        return res.status(500).json({ success: false, message: "Error al eliminar el paciente" });
      }

      return res.status(204).send();
    } catch (err) {
      if (err instanceof NotFoundError) {
        return res.status(404).json({ success: false, message: err.message });
      }
      return res.status(500).json({ success: false, error: err.message });
    }
  }
}

export default new PacientesController();
