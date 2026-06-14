import { pool } from "../config/db.js";

const EstadisticaModel = {
  async porObraSocial({ fecha_desde, fecha_hasta }) {
    const [rows] = await pool.query(
      "CALL sp_estadisticas_por_obra_social(?, ?)",
      [fecha_desde ?? null, fecha_hasta ?? null],
    );
    return rows[0];
  },

  async porMedico({ fecha_desde, fecha_hasta }) {
    const [rows] = await pool.query("CALL sp_estadisticas_por_medico(?, ?)", [
      fecha_desde ?? null,
      fecha_hasta ?? null,
    ]);
    return rows[0];
  },

  async porEspecialidad({ fecha_desde, fecha_hasta }) {
    const [rows] = await pool.query(
      "CALL sp_estadisticas_por_especialidad(?, ?)",
      [fecha_desde ?? null, fecha_hasta ?? null],
    );
    return rows[0];
  },

  async resumenGeneral({ fecha_desde, fecha_hasta }) {
    const [rows] = await pool.query("CALL sp_resumen_general_turnos(?, ?)", [
      fecha_desde ?? null,
      fecha_hasta ?? null,
    ]);
    return rows[0][0];
  },
};

export default EstadisticaModel;
