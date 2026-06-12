import { pool } from "../config/db.js";

const EstadisticaModel = {
  async porObraSocial({ fecha_desde, fecha_hasta }) {
    const [rows] = await pool.query("CALL sp_estadisticas_por_obra_social(?, ?)", [
      fecha_desde ?? null,
      fecha_hasta ?? null,
    ]);
    return rows[0];
  },
};

export default EstadisticaModel;
