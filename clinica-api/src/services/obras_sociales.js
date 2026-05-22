import ObraSocialModel from "../models/obra_social.js";

export class ObrasSocialesService {
  async browse({ page = 1, limit = 10, sort = "id_obra_social", order = "asc", filters = {} } = {}) {
    const offset = (page - 1) * limit;
    const allowedSort = ["id_obra_social", "nombre", "porcentaje_descuento"].includes(sort)
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
}

export default new ObrasSocialesService();
