import PacienteModel from "../models/paciente.js";
import ObraSocialModel from "../models/obra_social.js";
import { withTransaction } from "../config/db.js";

export class PacientesService {
  async browse({
    filters = {},
    page = 1,
    limit = 10,
    sort = "id_paciente",
    order = "asc",
  } = {}) {
    const offset = (page - 1) * limit;
    const allowedSort = [
      "id_paciente",
      "apellido",
      "nombres",
      "id_obra_social",
    ].includes(sort)
      ? sort
      : "id_paciente";
    const allowedOrder = ["asc", "desc"].includes(order?.toLowerCase())
      ? order.toLowerCase()
      : "asc";

    const rows = await PacienteModel.findPacientes({
      filters,
      limit,
      offset,
      sort: allowedSort,
      order: allowedOrder,
    });

    const total = await PacienteModel.countPacientes({ filters });

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
    return await PacienteModel.findById(id);
  }

  async create({ id_usuario, id_obra_social }) {
    await this.#validarObraSocialActiva(id_obra_social);

    const existing = await PacienteModel.findByIdUsuario(id_usuario);

    if (!existing) {
      const nuevo = await PacienteModel.create({ id_usuario, id_obra_social });
      return await PacienteModel.findById(nuevo.id_paciente);
    }

    if (existing.activo === 1) {
      throw new Error("El usuario ya tiene un paciente asociado");
    }

    // existing.activo === 0 → reactivar usuario + sobrescribir obra social
    // (ADR-001 Opción C). Transacción: 2 tablas.
    await withTransaction((conn) =>
      PacienteModel.reactivate(conn, {
        id_paciente: existing.id_paciente,
        id_usuario: existing.id_usuario,
        id_obra_social,
      }),
    );
    return await PacienteModel.findById(existing.id_paciente);
  }

  async update(id, { id_obra_social }) {
    await this.#validarObraSocialActiva(id_obra_social);

    const existing = await PacienteModel.findById(id);
    if (!existing) {
      return null;
    }

    const affectedRows = await PacienteModel.update(id, { id_obra_social });
    if (affectedRows === 0) {
      return null;
    }

    return PacienteModel.findById(id);
  }

  // Un paciente puede ser particular (sin obra social): solo se valida si viene informada.
  async #validarObraSocialActiva(id_obra_social) {
    if (id_obra_social === null || id_obra_social === undefined) {
      return;
    }
    const obraSocial = await ObraSocialModel.findById(id_obra_social);
    if (!obraSocial) {
      throw new Error("La obra social indicada no existe o no está activa");
    }
  }

  async delete(id) {
    const existing = await PacienteModel.findById(id);
    if (!existing) {
      return null;
    }
    const affectedRows = await PacienteModel.delete(existing.id_usuario);
    return affectedRows === 1;
  }
}

export default new PacientesService();
