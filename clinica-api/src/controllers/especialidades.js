import {
  especialidadesCreate,
  especialidadesResponse,
} from "../dtos/especialidades.dto.js";
import especialidadService from "../services/especialidades.js";

export class EspecialidadesController {
  async create(req, res) {
    try {
      const datos = especialidadesCreate(req.body);
      const nuevaEspecialidad = await especialidadService.createEspecialidad(
        datos.nombre,
      );

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
}

export default new EspecialidadesController();
