import { DuplicateError, ForeignKeyError, NotFoundError } from "../utils/errors.js";
import { medicosCreate, medicosResponse } from "../dtos/medicos.dto.js";
import { medicoObraSocialResponse } from "../dtos/medicos_obras_sociales.dto.js";
import medicoService from "../services/medicos.js";

export class MedicosController {
  async browse(req, res) {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = Math.min(parseInt(req.query.limit) || 10, 100);
      const sort = req.query.sort;
      const order = req.query.order;

      const filters = {};
      if (req.query.id_especialidad) filters.id_especialidad = req.query.id_especialidad;
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
      res.status(500).json({ success: false, message: err.message });
    }
  }

  async findById(req, res) {
    try {
      const { id } = req.params;
      const medicoEncontrado = await medicoService.readById(id);

      res.json(medicosResponse(medicoEncontrado));
    } catch (error) {
      if (error instanceof NotFoundError) {
        return res.status(404).json({ success: false, message: error.message });
      }
      res.status(500).json({ success: false, message: error.message });
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

      const resultado = await medicoService.findByEspecialidad(id_especialidad, {
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
    } catch (error) {
      if (error instanceof NotFoundError) {
        return res.status(404).json({ success: false, message: error.message });
      }
      res.status(500).json({ success: false, message: error.message });
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
        message: error.message,
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
        message: err.message,
      });
    }
  }

  async findObrasSociales(req, res) {
    try {
      const { id_medico } = req.params;
      const page = parseInt(req.query.page) || 1;
      const limit = Math.min(parseInt(req.query.limit) || 10, 100);
      const sort = req.query.sort;
      const order = req.query.order;

      const resultado = await medicoService.getObrasSociales(id_medico, {
        page,
        limit,
        sort,
        order,
      });

      const data = resultado.data.map(medicoObraSocialResponse);

      res.json({
        success: true,
        message:
          data.length === 0 ? "El médico solicitado no tiene obras sociales asignadas" : undefined,
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

  async delete(req, res) {
    try {
      const { id } = req.params;
      const deleted = await medicoService.delete(id);

      if (!deleted) {
        return res.status(500).json({
          success: false,
          message: "Error al eliminar el médico",
        });
      }

      return res.status(204).send();
    } catch (error) {
      if (error instanceof NotFoundError) {
        return res.status(404).json({ success: false, message: error.message });
      }
      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }
}

export default new MedicosController();
