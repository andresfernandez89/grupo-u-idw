import MedicoModel from "../models/medico.js";

export class MedicosService {
  async browse({ page = 1, limit = 10, sort = "id_medico", order = "asc", filters = {} }) {
    const offset = (page - 1) * limit;
    const allowedSort = [
      "id_medico",
      "matricula",
      "valor_consulta",
      "apellido",
      "nombres",
    ].includes(sort)
      ? sort
      : "id_medico";
    const allowedOrder = ["asc", "desc"].includes(order?.toLowerCase())
      ? order.toLowerCase()
      : "asc";

    const rows = await MedicoModel.findMedicos({
      limit,
      offset,
      sort: allowedSort,
      order: allowedOrder,
      filters,
    });

    const total = await MedicoModel.countMedicos({ filters });

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

  async findByEspecialidad(
    id_especialidad,
    { page = 1, limit = 10, sort = "id_medico", order = "asc", filters = {} } = {},
  ) {
    const offset = (page - 1) * limit;
    const allowedSort = [
      "id_medico",
      "matricula",
      "valor_consulta",
      "apellido",
      "nombres",
    ].includes(sort)
      ? sort
      : "id_medico";
    const allowedOrder = ["asc", "desc"].includes(order?.toLowerCase())
      ? order.toLowerCase()
      : "asc";

    const rows = await MedicoModel.findByEspecialidad(id_especialidad, {
      limit,
      offset,
      sort: allowedSort,
      order: allowedOrder,
      filters,
    });

    const total = await MedicoModel.countByEspecialidad(id_especialidad, { filters });

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
    return await MedicoModel.findById(id);
  }

  async create({
    id_usuario,
    id_especialidad,
    matricula,
    descripcion,
    valor_consulta,
  }) {
    const existing = await MedicoModel.findByMatricula(matricula);
    if (existing) {
      throw new Error("La matrícula ya está registrada");
    }
    return await MedicoModel.create({
      id_usuario,
      id_especialidad,
      matricula,
      descripcion,
      valor_consulta,
    });
  }

  async update(
    id,
    { id_usuario, id_especialidad, matricula, descripcion, valor_consulta },
  ) {
    const isMatriculaExist = await MedicoModel.findByMatricula(matricula);
    if (isMatriculaExist && isMatriculaExist.id_medico !== id) {
      throw new Error("La matrícula ya está registrada por otro médico");
    }

    const affectedRows = await MedicoModel.update(id, {
      id_usuario,
      id_especialidad,
      matricula,
      descripcion,
      valor_consulta,
    });

    if (affectedRows === 0) {
      return null;
    }

    return MedicoModel.findById(id);
  }

  async delete(id) {
    const existing = await MedicoModel.findById(id);
    if (!existing) {
      return null;
    }
    const affectedRows = await MedicoModel.delete(existing.id_usuario);
    return affectedRows === 1;
  }
}

export default new MedicosService();
