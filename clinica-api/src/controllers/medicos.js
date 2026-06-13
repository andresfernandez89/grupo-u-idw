import { DuplicateError, ForeignKeyError } from "../utils/errors.js";
import { medicosCreate, medicosResponse } from "../dtos/medicos.dto.js";
import medicoService from "../services/medicos.js";

export class MedicosController {
  async browse(req, res) {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = Math.min(parseInt(req.query.limit) || 10, 100);
      const sort = req.query.sort;
      const order = req.query.order;

      const filters = {};
      if (req.query.id_especialidad)
        filters.id_especialidad = req.query.id_especialidad;
      if (req.query.matricula) filters.matricula = req.query.matricula;
      if (req.query.apellido) filters.apellido = req.query.apellido;
      if (req.query.nombres) filters.nombres = req.query.nombres;

      const resultado = await medicoService.browse({
        filters,
        sort,
        order,
        page,
        limit,
      });

      res.json({
        success: true,
        data: resultado.data.map(medicosResponse),
        pagination: resultado.pagination,
      });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }

  async findById(req, res) {
    try {
      const { id } = req.params;
      const medicoEncontrado = await medicoService.readById(id);

      if (!medicoEncontrado) {
        return res.status(404).json({
          message: "No se encontró médico con el id solicitado",
        });
      }
      res.json(medicosResponse(medicoEncontrado));
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  async findByEspecialidad(req, res) {
    try {
      const { id_especialidad } = req.params;
      const page = parseInt(req.query.page) || 1;
      const limit = Math.min(parseInt(req.query.limit) || 10, 100);
      const sort = req.query.sort;
      const order = req.query.order;

      const filters = {};
      if (req.query.matricula) filters.matricula = req.query.matricula;
      if (req.query.apellido) filters.apellido = req.query.apellido;
      if (req.query.nombres) filters.nombres = req.query.nombres;

      const resultado = await medicoService.findByEspecialidad(
        id_especialidad,
        { filters, sort, order, page, limit },
      );

      if (!resultado.data || resultado.data.length === 0) {
        return res.status(404).json({
          message: "No se encontraron médicos para la especialidad solicitada",
        });
      }

      res.json({
        success: true,
        data: resultado.data.map(medicosResponse),
        pagination: resultado.pagination,
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  async create(req, res) {
    try {
      const datos = medicosCreate(req.body);
      const nuevoMedico = await medicoService.create(datos);

      return res.status(201).json({
        success: true,
        message: "Médico creado exitosamente",
        data: medicosResponse(nuevoMedico),
      });
    } catch (error) {
      if (error instanceof DuplicateError) {
        return res.status(409).json({ success: false, message: error.message });
      }
      if (error instanceof ForeignKeyError) {
        return res.status(400).json({ success: false, message: error.message });
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
      const datos = medicosCreate(req.body);

      const actualizado = await medicoService.update(id, datos);

      if (!actualizado) {
        return res.status(404).json({
          success: false,
          message: "Médico no encontrado",
        });
      }

      return res.status(200).json({
        success: true,
        message: "Médico modificado exitosamente",
        data: medicosResponse(actualizado),
      });
    } catch (err) {
      if (err instanceof DuplicateError) {
        return res.status(409).json({ success: false, message: err.message });
      }
      if (err instanceof ForeignKeyError) {
        return res.status(400).json({ success: false, message: err.message });
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
      const deleted = await medicoService.delete(id);

      if (deleted === null) {
        return res
          .status(404)
          .json({ success: false, message: "Médico no encontrado" });
      }

      if (!deleted) {
        return res.status(500).json({
          success: false,
          message: "Error al eliminar el médico",
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

export default new MedicosController();
