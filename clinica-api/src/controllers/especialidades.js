import {
  especialidadesCreate,
  especialidadesResponse,
} from "../dtos/especialidades.dto.js";

import especialidadService from "../services/especialidades.js";

export class EspecialidadesController {
  async browse(req, res) {
    try {
      const { nombre } = req.query;

      if (nombre) {
        const especialidad =
          await especialidadService.findByNombreActivo(nombre);

        if (!especialidad) {
          return res.status(404).json({
            message: "No se encontró especialidad con el nombre solicitado",
          });
        }

        return res.json(especialidadesResponse(especialidad));
      }

      const respuestas = await especialidadService.browse();
      res.json(respuestas.map(especialidadesResponse));
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
      if (error.message.includes("ya está registrado")) {
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
