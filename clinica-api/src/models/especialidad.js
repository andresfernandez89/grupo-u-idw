import { pool } from "../config/db.js";

const EspecialidadModel = {
  async findById(id) {
    const [rows] = await pool.query(
      "SELECT id_especialidad, nombre, activo FROM especialidades WHERE id_especialidad = ? AND activo = 1",
      [id],
    );
    return rows[0] ?? null;
  },

  async findByNombre(nombre) {
    const [rows] = await pool.query(
      "SELECT id_especialidad, nombre, activo FROM especialidades WHERE nombre = ? AND activo = 1",
      [nombre],
    );
    return rows[0] ?? null;
  },

  async create(nombre) {
    let connection;
    try {
      connection = await pool.getConnection();
      await connection.beginTransaction();

      const [result] = await connection.query(
        "INSERT INTO especialidades (nombre, activo) VALUES (?, ?)",
        [nombre, 1],
      );

      await connection.commit();
      return { id_especialidad: result.insertId, nombre, activo: 1 };
    } catch (error) {
      if (connection) await connection.rollback();
      throw error;
    } finally {
      if (connection) connection.release();
    }
  },

  async update(id, { nombre, activo }) {
    await pool.query(
      "UPDATE especialidades SET nombre = ?, activo = ? WHERE id_especialidad = ?",
      [nombre, activo, id],
    );
  },

  async delete(id) {
    let connection;
    try {
      connection = await pool.getConnection();
      await connection.beginTransaction();

      const [result] = await connection.query(
        "UPDATE especialidades SET activo = 0 WHERE id_especialidad = ? AND activo = 1",
        [id],
      );

      await connection.commit();
      return result.affectedRows;
    } catch (error) {
      if (connection) await connection.rollback();
      throw error;
    } finally {
      if (connection) connection.release();
    }
  },
};

export default EspecialidadModel;
