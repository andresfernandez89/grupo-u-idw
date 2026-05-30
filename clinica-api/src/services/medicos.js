import MedicoModel from "../models/medico.js";
import EspecialidadModel from "../models/especialidad.js";
import { withTransaction } from "../config/db.js";

export class MedicosService {
  async browse({
    filters = {},
    page = 1,
    limit = 10,
    sort = "id_medico",
    order = "asc",
  } = {}) {
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
      filters,
      limit,
      offset,
      sort: allowedSort,
      order: allowedOrder,
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
    {
      filters = {},
      page = 1,
      limit = 10,
      sort = "id_medico",
      order = "asc",
    } = {},
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
      filters,
      limit,
      offset,
      sort: allowedSort,
      order: allowedOrder,
    });

    const total = await MedicoModel.countByEspecialidad(id_especialidad, {
      filters,
    });

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
    const especialidad = await EspecialidadModel.findById(id_especialidad);
    if (!especialidad) {
      throw new Error("La especialidad indicada no existe o no está activa");
    }

    const existing = await MedicoModel.findByMatricula(matricula);

    if (!existing) {
      return await MedicoModel.create({
        id_usuario,
        id_especialidad,
        matricula,
        descripcion,
        valor_consulta,
      });
    }

    if (existing.activo === 1) {
      throw new Error("La matrícula ya está registrada");
    }

    // existing.activo === 0 → reactivar usuario asociado + sobrescribir médico
    // (id_usuario del payload se ignora, ADR-001). Transacción: 2 tablas.
    await withTransaction((conn) =>
      MedicoModel.reactivate(conn, {
        id_medico: existing.id_medico,
        id_usuario: existing.id_usuario,
        id_especialidad,
        matricula,
        descripcion,
        valor_consulta,
      }),
    );
    return await MedicoModel.findById(existing.id_medico);
  }

  async update(
    id,
    { id_usuario, id_especialidad, matricula, descripcion, valor_consulta },
  ) {
    const especialidad = await EspecialidadModel.findById(id_especialidad);
    if (!especialidad) {
      throw new Error("La especialidad indicada no existe o no está activa");
    }

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
