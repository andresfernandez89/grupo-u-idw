import { DuplicateError, ForeignKeyError } from "../utils/errors.js";
import MedicoModel from "../models/medico.js";
import ObraSocialModel from "../models/obra_social.js";
import PacienteModel from "../models/paciente.js";
import TurnoModel from "../models/turno.js";

export class TurnosService {
  async browse({
    filters = {},
    page = 1,
    limit = 10,
    sort = "id_turno_reserva",
    order = "asc",
  } = {}) {
    const offset = (page - 1) * limit;
    const allowedSort = [
      "id_turno_reserva",
      "fecha_hora",
      "valor_total",
      "atendido",
      "id_medico",
      "id_paciente",
    ].includes(sort)
      ? sort
      : "id_turno_reserva";
    const allowedOrder = ["asc", "desc"].includes(order?.toLowerCase())
      ? order.toLowerCase()
      : "asc";

    const rows = await TurnoModel.findTurnos({
      filters,
      limit,
      offset,
      sort: allowedSort,
      order: allowedOrder,
    });

    const total = await TurnoModel.countTurnos({ filters });

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
    return await TurnoModel.findById(id);
  }

  async create({ id_medico, id_paciente, id_obra_social, fecha_hora }) {
    const medico = await MedicoModel.findById(id_medico);
    if (!medico) {
      throw new ForeignKeyError("El médico indicado no existe o no está activo");
    }

    const paciente = await PacienteModel.findById(id_paciente);
    if (!paciente) {
      throw new ForeignKeyError("El paciente indicado no existe o no está activo");
    }

    const obraSocial = await ObraSocialModel.findById(id_obra_social);
    if (!obraSocial) {
      throw new ForeignKeyError("La obra social indicada no existe o no está activa");
    }

    const existeTurno = await TurnoModel.existsByMedicoYFecha(id_medico, fecha_hora);
    if (existeTurno) {
      throw new DuplicateError("El médico ya tiene un turno asignado en esa fecha y hora");
    }

    // ─── Cálculo de valor_total (regla de negocio) ───
    const valorConsulta = parseFloat(medico.valor_consulta);
    let valor_total;
    if (obraSocial.es_particular === 1) {
      valor_total = valorConsulta;
    } else {
      const descuento = parseFloat(obraSocial.porcentaje_descuento);
      valor_total = valorConsulta - descuento * valorConsulta;
    }

    const nuevo = await TurnoModel.create({
      id_medico,
      id_paciente,
      id_obra_social,
      fecha_hora,
      valor_total,
    });

    return await TurnoModel.findById(nuevo.id_turno_reserva);
  }

  async update(id, { id_medico, id_paciente, id_obra_social, fecha_hora }) {
    const existing = await TurnoModel.findById(id);
    if (!existing) {
      return null;
    }

    const medico = await MedicoModel.findById(id_medico);
    if (!medico) {
      throw new ForeignKeyError("El médico indicado no existe o no está activo");
    }

    const paciente = await PacienteModel.findById(id_paciente);
    if (!paciente) {
      throw new ForeignKeyError("El paciente indicado no existe o no está activo");
    }

    const obraSocial = await ObraSocialModel.findById(id_obra_social);
    if (!obraSocial) {
      throw new ForeignKeyError("La obra social indicada no existe o no está activa");
    }

    if (id_medico !== existing.id_medico || fecha_hora !== existing.fecha_hora) {
      const existeTurno = await TurnoModel.existsByMedicoYFecha(id_medico, fecha_hora);
      if (existeTurno) {
        throw new DuplicateError("El médico ya tiene un turno asignado en esa fecha y hora");
      }
    }

    // ─── Cálculo de valor_total (regla de negocio) ───
    const valorConsulta = parseFloat(medico.valor_consulta);
    let valor_total;
    if (obraSocial.es_particular === 1) {
      valor_total = valorConsulta;
    } else {
      const descuento = parseFloat(obraSocial.porcentaje_descuento);
      valor_total = valorConsulta - descuento * valorConsulta;
    }

    const affectedRows = await TurnoModel.update(id, {
      id_medico,
      id_paciente,
      id_obra_social,
      fecha_hora,
      valor_total,
    });

    if (affectedRows === 0) {
      return null;
    }

    return TurnoModel.findById(id);
  }

  async marcarAtendido(id) {
    const existing = await TurnoModel.findById(id);
    if (!existing) {
      return null;
    }

    const affectedRows = await TurnoModel.marcarAtendido(id);
    if (affectedRows === 0) {
      return null;
    }

    return TurnoModel.findById(id);
  }

  async delete(id) {
    const existing = await TurnoModel.findById(id);
    if (!existing) {
      return null;
    }

    const affectedRows = await TurnoModel.delete(id);
    return affectedRows === 1;
  }
}

export default new TurnosService();
