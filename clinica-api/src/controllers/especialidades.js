import { EspecialidadesService } from "../services/especialidades.js";

const service = new EspecialidadesService();

export class EspecialidadesController {
  async update(req, res) {
    const id = parseInt(req.params.id);
    const { nombre } = req.body;
    const actualizada = await service.update(id, nombre);
    if (!actualizada)
      return res.status(404).json({ mensaje: "Especialidad no encontrada" });
    res.json(actualizada);
  }
}
