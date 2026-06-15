import { clearCache } from "../config/cache.js";
import EspecialidadModel from "../models/especialidad.js";

export class EspecialidadesService {
  async browse({ filters = {}, page = 1, limit = 10, sort = "id_especialidad", order = "asc" }) {
    const offset = (page - 1) * limit;
    const allowedSort = ["id_especialidad", "nombre"].includes(sort) ? sort : "id_especialidad";
    const allowedOrder = ["asc", "desc"].includes(order?.toLowerCase())
      ? order.toLowerCase()
      : "asc";

    const rows = await EspecialidadModel.findEspecialidades({
      filters,
      limit,
      offset,
      sort: allowedSort,
      order: allowedOrder,
    });

    const total = await EspecialidadModel.countEspecialidades({ filters });

    return {
      data: rows,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async readById(id) {
    return await EspecialidadModel.findById(id);
  }

  async findByNombreActivo(nombre) {
    return await EspecialidadModel.findByNombreActivo(nombre);
  }

  async create(nombre) {
    const existing = await EspecialidadModel.findByNombre(nombre);

    if (!existing) {
      const nueva = await EspecialidadModel.create(nombre);
      clearCache("/especialidades");
      return nueva;
    }

    if (existing.activo === 1) {
      throw new Error("El nombre de la especialidad ya está registrado");
    }

    // existing.activo === 0 → reactivar (ADR-001 Opción C)
    await EspecialidadModel.reactivate(existing.id_especialidad, nombre);
    clearCache("/especialidades");
    return await EspecialidadModel.findById(existing.id_especialidad);
  }

  async update(id, { nombre }) {
    const existing = await EspecialidadModel.findByNombre(nombre);
    if (existing && existing.id_especialidad !== id) {
      throw new Error("El nombre de la especialidad ya está registrado");
    }

    const affectedRows = await EspecialidadModel.update(id, nombre);

    if (affectedRows === 0) {
      return null;
    }

    clearCache("/especialidades");
    return EspecialidadModel.findById(id);
  }

  async delete(id) {
    const existing = await EspecialidadModel.findById(id);
    if (!existing) {
      return null;
    }
    const affectedRows = await EspecialidadModel.delete(id);
    clearCache("/especialidades");
    return affectedRows === 1;
  }
}

export default new EspecialidadesService();
