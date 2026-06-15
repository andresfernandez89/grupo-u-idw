import { pool } from "../config/db.js";

const EspecialidadModel = {
  async findEspecialidades({ filters, limit, offset, sort, order }) {
    let sql = "SELECT id_especialidad, nombre, activo FROM especialidades WHERE activo = 1";
    const params = [];

    if (filters.nombre) {
      sql += " AND nombre = ?";
      params.push(filters.nombre);
    }

    sql += ` ORDER BY ${sort} ${order}`;
    sql += " LIMIT ? OFFSET ?";
    params.push(limit, offset);

    const [rows] = await pool.query(sql, params);
    return rows;
  },

  async countEspecialidades({ filters }) {
    let sql = "SELECT COUNT(*) AS total FROM especialidades WHERE activo = 1";
    const params = [];

    if (filters.nombre) {
      sql += " AND nombre = ?";
      params.push(filters.nombre);
    }

    const [rows] = await pool.query(sql, params);
    return rows[0].total;
  },

  async findById(id) {
    const [rows] = await pool.query(
      "SELECT id_especialidad, nombre, activo FROM especialidades WHERE id_especialidad = ? AND activo = 1",
      [id],
    );
    return rows[0] ?? null;
  },

  async findByNombre(nombre) {
    const [rows] = await pool.query(
      "SELECT id_especialidad, nombre, activo FROM especialidades WHERE nombre = ?",
      [nombre],
    );
    return rows[0] ?? null;
  },

  async findByNombreActivo(nombre) {
    const [rows] = await pool.query(
      "SELECT id_especialidad, nombre, activo FROM especialidades WHERE nombre = ? AND activo = 1",
      [nombre],
    );
    return rows[0] ?? null;
  },

  async create(nombre) {
    const [result] = await pool.query("INSERT INTO especialidades (nombre, activo) VALUES (?, ?)", [
      nombre,
      1,
    ]);
    return { id_especialidad: result.insertId, nombre, activo: 1 };
  },

  async update(id, nombre) {
    const [result] = await pool.query(
      "UPDATE especialidades SET nombre = ? WHERE id_especialidad = ? AND activo = 1",
      [nombre, id],
    );
    return result.affectedRows;
  },

  async delete(id) {
    const [result] = await pool.query(
      "UPDATE especialidades SET activo = 0 WHERE id_especialidad = ? AND activo = 1",
      [id],
    );
    return result.affectedRows;
  },

  async reactivate(id, nombre) {
    const [result] = await pool.query(
      "UPDATE especialidades SET nombre = ?, activo = 1 WHERE id_especialidad = ?",
      [nombre, id],
    );
    return result.affectedRows;
  },
};

export default EspecialidadModel;
