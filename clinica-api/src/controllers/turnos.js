import { turnoCreate, turnoResponse } from "../dtos/turnos.dto.js";
import medicoService from "../services/medicos.js";
import pacienteService from "../services/pacientes.js";
import turnoService from "../services/turnos.js";

export class TurnosController {
  async browse(req, res) {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = Math.min(parseInt(req.query.limit) || 10, 100);
      const sort = req.query.sort;
      const order = req.query.order;

      const filters = {};
      if (req.query.id_obra_social) filters.id_obra_social = req.query.id_obra_social;
      if (req.query.atendido !== undefined) filters.atendido = req.query.atendido;
      if (req.query.fecha_desde) filters.fecha_desde = req.query.fecha_desde;
      if (req.query.fecha_hasta) filters.fecha_hasta = req.query.fecha_hasta;

      const rol = req.user?.rol;
      if (rol === 1) {
        const medico = await medicoService.findByIdUsuario(req.user.id_usuario);
        if (!medico) {
          return res.status(403).json({
            success: false,
            message: "No se encontró un médico asociado a tu usuario",
          });
        }
        filters.id_medico = medico.id_medico;
      } else if (rol === 2) {
        const paciente = await pacienteService.findByIdUsuario(req.user.id_usuario);
        if (!paciente) {
          return res.status(403).json({
            success: false,
            message: "No se encontró un paciente asociado a tu usuario",
          });
        }
        filters.id_paciente = paciente.id_paciente;
      } else if (rol === 3) {
        if (req.query.id_medico) filters.id_medico = req.query.id_medico;
        if (req.query.id_paciente) filters.id_paciente = req.query.id_paciente;
      }

      const resultado = await turnoService.browse({
        filters,
        sort,
        order,
        page,
        limit,
      });

      res.json({
        success: true,
        data: resultado.data.map(turnoResponse),
        pagination: resultado.pagination,
      });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }

  async findById(req, res) {
    try {
      const { id } = req.params;
      const turno = await turnoService.readById(id);

      if (!turno) {
        return res.status(404).json({
          success: false,
          message: "No se encontró turno con el id solicitado",
        });
      }

      const rol = req.user?.rol;
      if (rol === 1) {
        const medico = await medicoService.findByIdUsuario(req.user.id_usuario);
        if (!medico || turno.id_medico !== medico.id_medico) {
          return res.status(403).json({
            success: false,
            message: "No tenés permisos para ver este turno",
          });
        }
      } else if (rol === 2) {
        const paciente = await pacienteService.findByIdUsuario(req.user.id_usuario);
        if (!paciente || turno.id_paciente !== paciente.id_paciente) {
          return res.status(403).json({
            success: false,
            message: "No tenés permisos para ver este turno",
          });
        }
      }

      res.json(turnoResponse(turno));
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }

  async create(req, res) {
    try {
      const datos = turnoCreate(req.body);

      const rol = req.user?.rol;
      if (rol === 2) {
        const paciente = await pacienteService.findByIdUsuario(req.user.id_usuario);
        if (!paciente) {
          return res.status(403).json({
            success: false,
            message: "No se encontró un paciente asociado a tu usuario",
          });
        }
        datos.id_paciente = paciente.id_paciente;
      }

      const nuevo = await turnoService.create(datos);

      return res.status(201).json({
        success: true,
        message: "Turno creado exitosamente",
        data: turnoResponse(nuevo),
      });
    } catch (err) {
      if (err.message.includes("no existe o no está activo")) {
        return res.status(400).json({ success: false, message: err.message });
      }
      if (err.message.includes("ya tiene un turno asignado")) {
        return res.status(409).json({ success: false, message: err.message });
      }
      return res.status(500).json({ success: false, error: err.message });
    }
  }

  async update(req, res) {
    try {
      const { id } = req.params;
      const datos = turnoCreate(req.body);
      const actualizado = await turnoService.update(id, datos);

      if (!actualizado) {
        return res
          .status(404)
          .json({ success: false, message: "Turno no encontrado" });
      }

      return res.status(200).json({
        success: true,
        message: "Turno modificado exitosamente",
        data: turnoResponse(actualizado),
      });
    } catch (err) {
      if (err.message.includes("no existe o no está activo")) {
        return res.status(400).json({ success: false, message: err.message });
      }
      if (err.message.includes("ya tiene un turno asignado")) {
        return res.status(409).json({ success: false, message: err.message });
      }
      return res.status(500).json({ success: false, error: err.message });
    }
  }

  async marcarAtendido(req, res) {
    try {
      const { id } = req.params;
      const turno = await turnoService.readById(id);

      if (!turno) {
        return res
          .status(404)
          .json({ success: false, message: "Turno no encontrado" });
      }

      const rol = req.user?.rol;
      if (rol === 1) {
        const medico = await medicoService.findByIdUsuario(req.user.id_usuario);
        if (!medico || turno.id_medico !== medico.id_medico) {
          return res.status(403).json({
            success: false,
            message: "No tenés permisos para modificar este turno",
          });
        }
      }

      const actualizado = await turnoService.marcarAtendido(id);

      return res.status(200).json({
        success: true,
        message: "Turno marcado como atendido",
        data: turnoResponse(actualizado),
      });
    } catch (err) {
      return res.status(500).json({ success: false, error: err.message });
    }
  }

  async delete(req, res) {
    try {
      const { id } = req.params;
      const deleted = await turnoService.delete(id);

      if (deleted === null) {
        return res
          .status(404)
          .json({ success: false, message: "Turno no encontrado" });
      }
      if (!deleted) {
        return res
          .status(500)
          .json({ success: false, message: "Error al eliminar el turno" });
      }

      return res.status(204).send();
    } catch (err) {
      return res.status(500).json({ success: false, error: err.message });
    }
  }
}

export default new TurnosController();
