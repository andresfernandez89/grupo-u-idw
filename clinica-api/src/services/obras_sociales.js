import ObraSocialModel from "../models/obra_social.js";

export class ObrasSocialesService {
  async browse({
    page = 1,
    limit = 10,
    sort = "id_obra_social",
    order = "asc",
    filters = {},
  } = {}) {
    const offset = (page - 1) * limit;
    const allowedSort = [
      "id_obra_social",
      "nombre",
      "porcentaje_descuento",
    ].includes(sort)
      ? sort
      : "id_obra_social";
    const allowedOrder = ["asc", "desc"].includes(order?.toLowerCase())
      ? order.toLowerCase()
      : "asc";

    const rows = await ObraSocialModel.findObrasSociales({
      limit,
      offset,
      sort: allowedSort,
      order: allowedOrder,
      filters,
    });

    const total = await ObraSocialModel.countObrasSociales({ filters });

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
    return await ObraSocialModel.findById(id);
  }

  async delete(id) {
    const existing = await ObraSocialModel.findById(id);
    if (!existing) return null;

    const affectedRows = await ObraSocialModel.delete(id);
    return affectedRows === 1;
  }

  async update(
    id,
    { nombre, descripcion, porcentaje_descuento, es_particular },
  ) {
    const existing = await ObraSocialModel.findByNombre(nombre);
    if (existing && existing.id_obra_social !== id) {
      throw new Error("El nombre de la obra social ya está registrado");
    }

    const affectedRows = await ObraSocialModel.update(id, {
      nombre,
      descripcion,
      porcentaje_descuento,
      es_particular,
    });

    if (affectedRows === 0) return null;

    return ObraSocialModel.findById(id);
  }

  async create({ nombre, descripcion, porcentaje_descuento, es_particular }) {
    const existing = await ObraSocialModel.findByNombre(nombre);

    if (!existing) {
      return await ObraSocialModel.create({
        nombre,
        descripcion,
        porcentaje_descuento,
        es_particular,
      });
    }

    if (existing.activo === 1) {
      throw new Error("El nombre de la obra social ya está registrado");
    }

    // existing.activo === 0 → reactivar (ADR-001 Opción C)
    await ObraSocialModel.reactivate(existing.id_obra_social, {
      nombre,
      descripcion,
      porcentaje_descuento,
      es_particular,
    });
    return await ObraSocialModel.findById(existing.id_obra_social);
  }
}

export default new ObrasSocialesService();
