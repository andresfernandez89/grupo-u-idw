import MedicoObraSocialModel from "../models/medico_obra_social.js";
import MedicoModel from "../models/medico.js";
import ObraSocialModel from "../models/obra_social.js";

export class MedicosObrasSocialesService {
  async browse({
    page = 1,
    limit = 10,
    sort = "id_medico_obra_social",
    order = "asc",
    filters = {},
  } = {}) {
    const offset = (page - 1) * limit;
    const allowedSort = [
      "id_medico_obra_social",
      "id_medico",
      "id_obra_social",
    ].includes(sort)
      ? sort
      : "id_medico_obra_social";
    const allowedOrder = ["asc", "desc"].includes(order?.toLowerCase())
      ? order.toLowerCase()
      : "asc";

    const rows = await MedicoObraSocialModel.findAll({
      limit,
      offset,
      sort: allowedSort,
      order: allowedOrder,
      filters,
    });

    const total = await MedicoObraSocialModel.countAll({ filters });

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
    return await MedicoObraSocialModel.findById(id);
  }

  async create({ id_medico, id_obra_social }) {
    const existing = await MedicoObraSocialModel.findByMedicoAndObraSocial(
      id_medico,
      id_obra_social,
    );

    if (existing) {
      throw new Error("El médico ya tiene asignada esa obra social");
    }

    return await MedicoObraSocialModel.create({ id_medico, id_obra_social });
  }

  async update(id, { id_medico, id_obra_social }) {
    const existing = await MedicoObraSocialModel.findByMedicoAndObraSocial(
      id_medico,
      id_obra_social,
    );

    if (existing && existing.id_medico_obra_social !== id) {
      throw new Error("El médico ya tiene asignada esa obra social");
    }

    const affectedRows = await MedicoObraSocialModel.update(id, {
      id_medico,
      id_obra_social,
    });

    if (affectedRows === 0) return null;

    return MedicoObraSocialModel.findById(id);
  }

  async delete(id) {
    const existing = await MedicoObraSocialModel.findById(id);
    if (!existing) return null;

    const affectedRows = await MedicoObraSocialModel.delete(id);
    return affectedRows === 1;
  }
}

export default new MedicosObrasSocialesService();
