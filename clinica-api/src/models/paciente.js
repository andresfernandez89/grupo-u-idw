import { pool } from "../config/db.js";

const PacienteModel = {
  async findPacientes({ filters, limit, offset, sort, order }) {
    let sql = `SELECT id_paciente, id_usuario, apellido, nombres, email, id_obra_social, descripcion_obra_social, foto_path
               FROM v_pacientes
               WHERE 1=1`;
    const params = [];

    if (filters.apellido) {
      sql += " AND apellido = ?";
      params.push(filters.apellido);
    }
    if (filters.nombres) {
      sql += " AND nombres = ?";
      params.push(filters.nombres);
    }
    if (filters.id_obra_social !== undefined) {
      sql += " AND id_obra_social = ?";
      params.push(filters.id_obra_social);
    }

    sql += ` ORDER BY ${sort} ${order}`;
    sql += " LIMIT ? OFFSET ?";
    params.push(limit, offset);

    const [rows] = await pool.query(sql, params);
    return rows;
  },

  async countPacientes({ filters }) {
    let sql = `SELECT COUNT(*) AS total FROM v_pacientes WHERE 1=1`;
    const params = [];

    if (filters.apellido) {
      sql += " AND apellido = ?";
      params.push(filters.apellido);
    }
    if (filters.nombres) {
      sql += " AND nombres = ?";
      params.push(filters.nombres);
    }
    if (filters.id_obra_social !== undefined) {
      sql += " AND id_obra_social = ?";
      params.push(filters.id_obra_social);
    }

    const [rows] = await pool.query(sql, params);
    return rows[0].total;
  },

  async findById(id) {
    const [rows] = await pool.query(
      `SELECT id_paciente, id_usuario, apellido, nombres, email, id_obra_social, descripcion_obra_social, foto_path
       FROM v_pacientes
       WHERE id_paciente = ?`,
      [id],
    );
    return rows[0] ?? null;
  },

  async findByIdUsuario(id_usuario) {
    const [rows] = await pool.query(
      `SELECT id_paciente, id_usuario, id_obra_social FROM pacientes WHERE id_usuario = ?`,
      [id_usuario],
    );
    return rows[0] ?? null;
  },

  async create({ id_usuario, id_obra_social }) {
    const [result] = await pool.query(
      `INSERT INTO pacientes (id_usuario, id_obra_social) VALUES (?, ?)`,
      [id_usuario, id_obra_social],
    );
    return { id_paciente: result.insertId, id_usuario, id_obra_social };
  },

  async update(id, { id_obra_social }) {
    const [result] = await pool.query(
      `UPDATE pacientes SET id_obra_social = ? WHERE id_paciente = ?`,
      [id_obra_social, id],
    );
    return result.affectedRows;
  },

  async delete(id_usuario) {
    const [result] = await pool.query(
      "UPDATE usuarios SET activo = 0 WHERE id_usuario = ? AND activo = 1",
      [id_usuario],
    );
    return result.affectedRows;
  },
};

export default PacienteModel;
