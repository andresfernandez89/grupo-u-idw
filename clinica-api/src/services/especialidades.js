import EspecialidadModel from "../models/especialidad.js";

export class EspecialidadesService {
  async browse() {
    return await EspecialidadModel.findEspecialidades();
  }

  async readById(id) {
    return await EspecialidadModel.findById(id);
  }

  async create(nombre) {
    const existing = await EspecialidadModel.findByNombre(nombre);
    if (existing) {
      throw new Error("El nombre de la especialidad ya está registrado");
    }
    return await EspecialidadModel.create(nombre);
  }

  async update(id, { nombre, activo }) {
    const existente = await EspecialidadModel.findById(id);
    if (!existente) return null;
    await EspecialidadModel.update(id, { nombre, activo });
    return EspecialidadModel.findById(id);
  }

  async delete(id) {
    const existing = await EspecialidadModel.findById(id);
    if (!existing) {
      return null;
    }
    const affectedRows = await EspecialidadModel.delete(id);
    return affectedRows === 1;
  }
}

export default new EspecialidadesService();
