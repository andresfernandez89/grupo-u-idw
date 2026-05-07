import EspecialidadModel from "../models/especialidad.js";

export class EspecialidadesService {
  async createEspecialidad(nombre) {
    const existing = await EspecialidadModel.findByNombre(nombre);
    if (existing) {
      throw new Error("El nombre de la especialidad ya está registrado");
    }
    return await EspecialidadModel.create(nombre);
  }
}

export default new EspecialidadesService();
