import { pool } from "../config/db.js";

const TurnoModel = {
  async findTurnos({ filters, limit, offset, sort, order }) {
    const sqlSort = sort === "atendido" ? "atentido" : sort;

    let sql = `SELECT id_turno_reserva, id_medico, id_paciente, id_obra_social,
                      fecha_hora, valor_total, atentido AS atendido, activo
               FROM turnos_reservas
               WHERE activo = 1`;
    const params = [];

    if (filters.id_medico) {
      sql += " AND id_medico = ?";
      params.push(filters.id_medico);
    }
    if (filters.id_paciente) {
      sql += " AND id_paciente = ?";
      params.push(filters.id_paciente);
    }
    if (filters.id_obra_social) {
      sql += " AND id_obra_social = ?";
      params.push(filters.id_obra_social);
    }
    if (filters.atendido !== undefined) {
      sql += " AND atentido = ?";
      params.push(filters.atendido);
    }
    if (filters.fecha_desde) {
      sql += " AND fecha_hora >= ?";
      params.push(filters.fecha_desde);
    }
    if (filters.fecha_hasta) {
      sql += " AND fecha_hora <= ?";
      params.push(filters.fecha_hasta);
    }

    sql += ` ORDER BY ${sqlSort} ${order}`;
    sql += " LIMIT ? OFFSET ?";
    params.push(limit, offset);

    const [rows] = await pool.query(sql, params);
    return rows;
  },

  async countTurnos({ filters }) {
    let sql = `SELECT COUNT(*) AS total FROM turnos_reservas WHERE activo = 1`;
    const params = [];

    if (filters.id_medico) {
      sql += " AND id_medico = ?";
      params.push(filters.id_medico);
    }
    if (filters.id_paciente) {
      sql += " AND id_paciente = ?";
      params.push(filters.id_paciente);
    }
    if (filters.id_obra_social) {
      sql += " AND id_obra_social = ?";
      params.push(filters.id_obra_social);
    }
    if (filters.atendido !== undefined) {
      sql += " AND atentido = ?";
      params.push(filters.atendido);
    }
    if (filters.fecha_desde) {
      sql += " AND fecha_hora >= ?";
      params.push(filters.fecha_desde);
    }
    if (filters.fecha_hasta) {
      sql += " AND fecha_hora <= ?";
      params.push(filters.fecha_hasta);
    }

    const [rows] = await pool.query(sql, params);
    return rows[0].total;
  },

  async findById(id) {
    const [rows] = await pool.query(
      `SELECT id_turno_reserva, id_medico, id_paciente, id_obra_social,
              fecha_hora, valor_total, atentido AS atendido, activo
       FROM turnos_reservas
       WHERE id_turno_reserva = ? AND activo = 1`,
      [id],
    );
    return rows[0] ?? null;
  },

  async findByMedico(id_medico, { limit, offset, sort, order }) {
    const sqlSort = sort === "atendido" ? "atentido" : sort;

    let sql = `SELECT id_turno_reserva, id_medico, id_paciente, id_obra_social,
                      fecha_hora, valor_total, atentido AS atendido, activo
               FROM turnos_reservas
               WHERE activo = 1 AND id_medico = ?`;
    const params = [id_medico];

    sql += ` ORDER BY ${sqlSort} ${order}`;
    sql += " LIMIT ? OFFSET ?";
    params.push(limit, offset);

    const [rows] = await pool.query(sql, params);
    return rows;
  },

  async countByMedico(id_medico) {
    const [rows] = await pool.query(
      `SELECT COUNT(*) AS total FROM turnos_reservas WHERE activo = 1 AND id_medico = ?`,
      [id_medico],
    );
    return rows[0].total;
  },

  async findByPaciente(id_paciente, { limit, offset, sort, order }) {
    const sqlSort = sort === "atendido" ? "atentido" : sort;

    let sql = `SELECT id_turno_reserva, id_medico, id_paciente, id_obra_social,
                      fecha_hora, valor_total, atentido AS atendido, activo
               FROM turnos_reservas
               WHERE activo = 1 AND id_paciente = ?`;
    const params = [id_paciente];

    sql += ` ORDER BY ${sqlSort} ${order}`;
    sql += " LIMIT ? OFFSET ?";
    params.push(limit, offset);

    const [rows] = await pool.query(sql, params);
    return rows;
  },

  async countByPaciente(id_paciente) {
    const [rows] = await pool.query(
      `SELECT COUNT(*) AS total FROM turnos_reservas WHERE activo = 1 AND id_paciente = ?`,
      [id_paciente],
    );
    return rows[0].total;
  },

  async existsByMedicoYFecha(id_medico, fecha_hora) {
    const [rows] = await pool.query(
      `SELECT 1 FROM turnos_reservas
       WHERE id_medico = ? AND fecha_hora = ? AND activo = 1
       LIMIT 1`,
      [id_medico, fecha_hora],
    );
    return rows.length > 0;
  },

  async create({ id_medico, id_paciente, id_obra_social, fecha_hora, valor_total }) {
    const [result] = await pool.query(
      `INSERT INTO turnos_reservas (id_medico, id_paciente, id_obra_social, fecha_hora, valor_total, atentido, activo)
       VALUES (?, ?, ?, ?, ?, 0, 1)`,
      [id_medico, id_paciente, id_obra_social, fecha_hora, valor_total],
    );
    return { id_turno_reserva: result.insertId, id_medico, id_paciente, id_obra_social, fecha_hora, valor_total };
  },

  async update(id, { id_medico, id_paciente, id_obra_social, fecha_hora, valor_total }) {
    const [result] = await pool.query(
      `UPDATE turnos_reservas
       SET id_medico = ?, id_paciente = ?, id_obra_social = ?, fecha_hora = ?, valor_total = ?
       WHERE id_turno_reserva = ? AND activo = 1`,
      [id_medico, id_paciente, id_obra_social, fecha_hora, valor_total, id],
    );
    return result.affectedRows;
  },

  async marcarAtendido(id) {
    const [result] = await pool.query(
      `UPDATE turnos_reservas SET atentido = 1 WHERE id_turno_reserva = ? AND activo = 1`,
      [id],
    );
    return result.affectedRows;
  },

  async delete(id) {
    const [result] = await pool.query(
      "UPDATE turnos_reservas SET activo = 0 WHERE id_turno_reserva = ? AND activo = 1",
      [id],
    );
    return result.affectedRows;
  },
};

export default TurnoModel;
