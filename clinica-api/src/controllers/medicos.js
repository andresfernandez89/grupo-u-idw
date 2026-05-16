import { medicosCreate, medicosResponse } from "../dtos/medicos.dto.js";
import medicoService from "../services/medicos.js";

export class MedicosController {
  async browse(req, res) {
    try {
      const respuestas = await medicoService.browse();
      res.json(respuestas.map(medicosResponse));
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
      const medicos = await medicoService.findByEspecialidad(id_especialidad);

      if (!medicos || medicos.length === 0) {
        return res.status(404).json({
          message: "No se encontraron médicos para la especialidad solicitada",
        });
      }

      res.json(medicos.map(medicosResponse));
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
      if (error.message.includes("ya está registrada")) {
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
      if (err.message.includes("ya está registrada")) {
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
