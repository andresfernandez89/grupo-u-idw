import { DuplicateError, NotFoundError } from "../utils/errors.js";
import MedicoModel from "../models/medico.js";
import MedicoObraSocialModel from "../models/medico_obra_social.js";
import ObraSocialModel from "../models/obra_social.js";
import { withTransaction } from "../config/db.js";

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
    const medicoObraSocial = await MedicoObraSocialModel.findById(id);
    if (!medicoObraSocial) {
      throw new NotFoundError(
        "No se encontró la relación médico-obra social con el id solicitado",
      );
    }
    return medicoObraSocial;
  }

  async create({ id_medico, id_obra_social }) {
    const medico = await MedicoModel.findById(id_medico);
    if (!medico) {
      throw new NotFoundError("El médico indicado no existe o no está activo");
    }

    const obraSocial = await ObraSocialModel.findById(id_obra_social);
    if (!obraSocial) {
      throw new NotFoundError("La obra social indicada no existe o no está activa");
    }

    const existing =
      await MedicoObraSocialModel.findByMedicoObraSocialSinActivo(
        id_medico,
        id_obra_social,
      );

    if (!existing) {
      return await MedicoObraSocialModel.create({ id_medico, id_obra_social });
    }

    if (existing.activo === 1) {
      throw new DuplicateError("El médico ya tiene asignada esa obra social");
    }

    await withTransaction((conn) =>
      MedicoObraSocialModel.reactivate(conn, { id_medico, id_obra_social }),
    );

    return {
      id_medico_obra_social: existing.id_medico_obra_social,
      id_medico,
      id_obra_social,
    };
  }

  async update(id_medico_viejo, id_obra_social_vieja, { id_medico, id_obra_social }) {
    const oldRelation = await MedicoObraSocialModel.findByMedicoObraSocial(
      id_medico_viejo,
      id_obra_social_vieja,
    );
    if (!oldRelation) {
      throw new NotFoundError("No se encontró la relación a reemplazar");
    }

    const medico = await MedicoModel.findById(id_medico);
    if (!medico) throw new NotFoundError("El nuevo médico no existe o no está activo");

    const obraSocial = await ObraSocialModel.findById(id_obra_social);
    if (!obraSocial) throw new NotFoundError("La nueva obra social no existe o no está activa");

    const existing = await MedicoObraSocialModel.findByMedicoObraSocialSinActivo(id_medico, id_obra_social);
    if (existing?.activo === 1) {
      throw new DuplicateError("El médico ya tiene asignada esa obra social");
    }

    return await withTransaction(async (conn) => {
      await MedicoObraSocialModel.deleteByMedicoObraSocial(id_medico_viejo, id_obra_social_vieja, conn);

      if (!existing) {
        return await MedicoObraSocialModel.create({ id_medico, id_obra_social }, conn);
      }

      await MedicoObraSocialModel.reactivate(conn, { id_medico, id_obra_social });
      return {
        id_medico_obra_social: existing.id_medico_obra_social,
        id_medico,
        id_obra_social,
      };
    });
  }

  async delete(id_medico, id_obra_social) {
    const existing = await MedicoObraSocialModel.findByMedicoObraSocial(
      id_medico,
      id_obra_social,
    );
    if (!existing) return null;

    const affectedRows = await MedicoObraSocialModel.deleteByMedicoObraSocial(
      id_medico,
      id_obra_social,
    );
    return affectedRows === 1;
  }
}

export default new MedicosObrasSocialesService();
