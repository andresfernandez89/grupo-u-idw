import { DuplicateError, ForeignKeyError, NotFoundError } from "../utils/errors.js";
import MedicoModel from "../models/medico.js";
import EspecialidadModel from "../models/especialidad.js";
import { withTransaction } from "../config/db.js";

export class MedicosService {
  async browse({ filters = {}, page = 1, limit = 10, sort = "id_medico", order = "asc" } = {}) {
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
    { filters = {}, page = 1, limit = 10, sort = "id_medico", order = "asc" } = {},
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
    if (!rows || rows.length === 0) {
      throw new NotFoundError("No se encontraron médicos para la especialidad indicada");
    }

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
    const medico = await MedicoModel.findById(id);
    if (!medico) {
      throw new NotFoundError("El médico indicado no existe o no está activo");
    }
    return medico;
  }

  async findByIdUsuario(id_usuario) {
    return await MedicoModel.findByIdUsuario(id_usuario);
  }

  async create({ id_usuario, id_especialidad, matricula, descripcion, valor_consulta }) {
    const especialidad = await EspecialidadModel.findById(id_especialidad);
    if (!especialidad) {
      throw new ForeignKeyError("La especialidad indicada no existe o no está activa");
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
      throw new DuplicateError("La matrícula ya está registrada");
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

  async update(id, { id_usuario, id_especialidad, matricula, descripcion, valor_consulta }) {
    const especialidad = await EspecialidadModel.findById(id_especialidad);
    if (!especialidad) {
      throw new ForeignKeyError("La especialidad indicada no existe o no está activa");
    }

    const isMatriculaExist = await MedicoModel.findByMatricula(matricula);
    if (isMatriculaExist && isMatriculaExist.id_medico !== id) {
      throw new DuplicateError("La matrícula ya está registrada por otro médico");
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
      throw new NotFoundError("El médico indicado no existe o no está activo");
    }
    const affectedRows = await MedicoModel.delete(existing.id_usuario);
    return affectedRows === 1;
  }

  async getObrasSociales(
    id_medico,
    { page = 1, limit = 10, sort = "id_medico_obra_social", order = "asc" } = {},
  ) {
    const offset = (page - 1) * limit;
    const allowedSort = ["id_medico_obra_social", "id_medico", "id_obra_social"].includes(sort)
      ? sort
      : "id_medico_obra_social";
    const allowedOrder = ["asc", "desc"].includes(order?.toLowerCase())
      ? order.toLowerCase()
      : "asc";

    const medico = await MedicoModel.findById(id_medico);
    if (!medico) {
      throw new NotFoundError("El médico indicado no existe o no está activo");
    }

    const rows = await MedicoModel.findObrasSociales(id_medico, {
      limit,
      offset,
      sort: allowedSort,
      order: allowedOrder,
    });
    if (!rows || rows.length === 0) {
      throw new NotFoundError("El médico indicado no tiene obras sociales asignadas");
    }
    const total = await MedicoModel.countObrasSociales(id_medico);

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
}

export default new MedicosService();
