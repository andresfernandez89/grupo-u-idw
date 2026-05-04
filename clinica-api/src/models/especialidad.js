import { pool } from "../config/db.js";

export const EspecialidadModel = {
  async findById(id) {
    const [rows] = await pool.query(
      "SELECT id_especialidad, nombre FROM especialidades WHERE id_especialidad = ? AND activo = 1",
      [id],
    );
    return rows[0] ?? null;
  },
};
