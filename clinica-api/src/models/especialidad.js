import { pool } from "../config/db.js";

export const EspecialidadModel = {
  async findById(id) {
    const [rows] = await pool.query(
      "SELECT id_especialidad, nombre, activo FROM especialidades WHERE id_especialidad = ?",
      [id],
    );
    return rows[0] ?? null;
  },

  async update(id, { nombre, activo }) {
    await pool.query(
      "UPDATE especialidades SET nombre = ?, activo = ? WHERE id_especialidad = ?",
      [nombre, activo, id],
    );
  },
};
