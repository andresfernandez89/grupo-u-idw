import { pool } from "../config/db.js";

const MedicoObraSocialModel = {
  async findAll({ limit, offset, sort, order, filters }) {
    let sql = `SELECT mos.id_medico_obra_social, mos.id_medico, mos.id_obra_social, mos.activo,
                      v.apellido AS medico_apellido, v.nombres AS medico_nombres,
                      os.nombre AS obra_social_nombre
               FROM medicos_obras_sociales mos
               JOIN v_medicos v ON mos.id_medico = v.id_medico
               JOIN obras_sociales os ON mos.id_obra_social = os.id_obra_social
               WHERE mos.activo = 1`;
    const params = [];

    if (filters.id_medico) {
      sql += " AND mos.id_medico = ?";
      params.push(filters.id_medico);
    }

    if (filters.id_obra_social) {
      sql += " AND mos.id_obra_social = ?";
      params.push(filters.id_obra_social);
    }

    sql += ` ORDER BY ${sort} ${order}`;
    sql += " LIMIT ? OFFSET ?";
    params.push(limit, offset);

    const [rows] = await pool.query(sql, params);
    return rows;
  },

  async countAll({ filters }) {
    let sql = `SELECT COUNT(*) AS total
               FROM medicos_obras_sociales mos
               WHERE mos.activo = 1`;
    const params = [];

    if (filters.id_medico) {
      sql += " AND mos.id_medico = ?";
      params.push(filters.id_medico);
    }

    if (filters.id_obra_social) {
      sql += " AND mos.id_obra_social = ?";
      params.push(filters.id_obra_social);
    }

    const [rows] = await pool.query(sql, params);
    return rows[0].total;
  },

  async findById(id) {
    const [rows] = await pool.query(
      `SELECT mos.id_medico_obra_social, mos.id_medico, mos.id_obra_social, mos.activo,
              v.apellido AS medico_apellido, v.nombres AS medico_nombres,
              os.nombre AS obra_social_nombre
       FROM medicos_obras_sociales mos
       JOIN v_medicos v ON mos.id_medico = v.id_medico
       JOIN obras_sociales os ON mos.id_obra_social = os.id_obra_social
       WHERE mos.id_medico_obra_social = ? AND mos.activo = 1`,
      [id],
    );
    return rows[0] ?? null;
  },

  async findByMedicoAndObraSocial(id_medico, id_obra_social) {
    const [rows] = await pool.query(
      `SELECT id_medico_obra_social, id_medico, id_obra_social, activo
       FROM medicos_obras_sociales
       WHERE id_medico = ? AND id_obra_social = ? AND activo = 1`,
      [id_medico, id_obra_social],
    );
    return rows[0] ?? null;
  },

  async create({ id_medico, id_obra_social }) {
    const [result] = await pool.query(
      `INSERT INTO medicos_obras_sociales (id_medico, id_obra_social, activo)
       VALUES (?, ?, 1)`,
      [id_medico, id_obra_social],
    );
    return { id_medico_obra_social: result.insertId, id_medico, id_obra_social };
  },

  async update(id, { id_medico, id_obra_social }) {
    const [result] = await pool.query(
      `UPDATE medicos_obras_sociales
       SET id_medico = ?, id_obra_social = ?
       WHERE id_medico_obra_social = ? AND activo = 1`,
      [id_medico, id_obra_social, id],
    );
    return result.affectedRows;
  },

  async delete(id) {
    const [result] = await pool.query(
      "UPDATE medicos_obras_sociales SET activo = 0 WHERE id_medico_obra_social = ? AND activo = 1",
      [id],
    );
    return result.affectedRows;
  },
};

export default MedicoObraSocialModel;
