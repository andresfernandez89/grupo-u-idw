import { pool } from "../config/db.js";

const EspecialidadModel = {
  async findEspecialidades() {
    const [rows] = await pool.query(
      "SELECT id_especialidad, nombre, activo FROM especialidades WHERE activo = 1",
    );
    return rows;
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
    const [result] = await pool.query(
      "INSERT INTO especialidades (nombre, activo) VALUES (?, ?)",
      [nombre, 1],
    );
    return { id_especialidad: result.insertId, nombre, activo: 1 };
  },

  async update(id, nombre) {
    await pool.query(
      "UPDATE especialidades SET nombre = ? WHERE id_especialidad = ? AND activo = 1",
      [nombre, id],
    );
  },

  async delete(id) {
    const [result] = await pool.query(
      "UPDATE especialidades SET activo = 0 WHERE id_especialidad = ? AND activo = 1",
      [id],
    );
    return result.affectedRows;
  },
};

export default EspecialidadModel;
