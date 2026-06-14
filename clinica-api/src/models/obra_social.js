import { pool } from "../config/db.js";

const ObraSocialModel = {
  async findObrasSociales({ limit, offset, sort, order, filters }) {
    let sql = `SELECT id_obra_social, nombre, descripcion, porcentaje_descuento, es_particular
               FROM obras_sociales
               WHERE activo = 1`;
    const params = [];

    if (filters.nombre) {
      sql += " AND nombre = ?";
      params.push(filters.nombre);
    }
    if (filters.es_particular !== undefined) {
      sql += " AND es_particular = ?";
      params.push(filters.es_particular);
    }

    sql += ` ORDER BY ${sort} ${order}`;
    sql += " LIMIT ? OFFSET ?";
    params.push(limit, offset);

    const [rows] = await pool.query(sql, params);
    return rows;
  },

  async countObrasSociales({ filters }) {
    let sql = `SELECT COUNT(*) AS total
               FROM obras_sociales
               WHERE activo = 1`;
    const params = [];

    if (filters.nombre) {
      sql += " AND nombre = ?";
      params.push(filters.nombre);
    }
    if (filters.es_particular !== undefined) {
      sql += " AND es_particular = ?";
      params.push(filters.es_particular);
    }

    const [rows] = await pool.query(sql, params);
    return rows[0].total;
  },

  async findByNombre(nombre) {
    const [rows] = await pool.query(
      `SELECT id_obra_social, nombre, descripcion, porcentaje_descuento, es_particular, activo
       FROM obras_sociales
       WHERE nombre = ?`,
      [nombre],
    );
    return rows[0] ?? null;
  },

  async create({ nombre, descripcion, porcentaje_descuento, es_particular }) {
    const [result] = await pool.query(
      `INSERT INTO obras_sociales (nombre, descripcion, porcentaje_descuento, es_particular, activo)
       VALUES (?, ?, ?, ?, 1)`,
      [nombre, descripcion, porcentaje_descuento, es_particular],
    );
    return {
      id_obra_social: result.insertId,
      nombre,
      descripcion,
      porcentaje_descuento,
      es_particular,
    };
  },

  async update(
    id,
    { nombre, descripcion, porcentaje_descuento, es_particular },
  ) {
    const [result] = await pool.query(
      `UPDATE obras_sociales
       SET nombre = ?, descripcion = ?, porcentaje_descuento = ?, es_particular = ?
       WHERE id_obra_social = ? AND activo = 1`,
      [nombre, descripcion, porcentaje_descuento, es_particular, id],
    );
    return result.affectedRows;
  },

  async delete(id) {
    const [result] = await pool.query(
      "UPDATE obras_sociales SET activo = 0 WHERE id_obra_social = ? AND activo = 1",
      [id],
    );

    await pool.query(
      "UPDATE medicos_obras_sociales SET activo = 0 WHERE id_obra_social = ? AND activo = 1",
      [id],
    );

    return result.affectedRows;
  },

  async reactivate(
    id,
    { nombre, descripcion, porcentaje_descuento, es_particular },
  ) {
    const [result] = await pool.query(
      `UPDATE obras_sociales
       SET nombre = ?, descripcion = ?, porcentaje_descuento = ?, es_particular = ?, activo = 1
       WHERE id_obra_social = ?`,
      [nombre, descripcion, porcentaje_descuento, es_particular, id],
    );
    return result.affectedRows;
  },

  async findMedicos(id_obra_social, { limit, offset, sort, order }) {
    let sql = `SELECT mos.id_medico_obra_social, mos.id_medico, mos.id_obra_social, mos.activo,
                      v.apellido AS medico_apellido, v.nombres AS medico_nombres,
                      os.nombre AS obra_social_nombre
               FROM medicos_obras_sociales mos
               JOIN v_medicos v ON mos.id_medico = v.id_medico
               JOIN obras_sociales os ON mos.id_obra_social = os.id_obra_social
               WHERE mos.id_obra_social = ? AND mos.activo = 1 AND os.activo = 1`;
    const params = [id_obra_social];

    sql += ` ORDER BY ${sort} ${order}`;
    sql += " LIMIT ? OFFSET ?";
    params.push(limit, offset);

    const [rows] = await pool.query(sql, params);
    return rows;
  },

  async countMedicos(id_obra_social) {
    const [rows] = await pool.query(
      `SELECT COUNT(*) AS total
       FROM medicos_obras_sociales mos
       JOIN obras_sociales os ON mos.id_obra_social = os.id_obra_social
       WHERE mos.id_obra_social = ? AND mos.activo = 1 AND os.activo = 1`,
      [id_obra_social],
    );
    return rows[0].total;
  },

  async findById(id) {
    const [rows] = await pool.query(
      `SELECT id_obra_social, nombre, descripcion, porcentaje_descuento, es_particular
       FROM obras_sociales
       WHERE id_obra_social = ? AND activo = 1`,
      [id],
    );
    return rows[0] ?? null;
  },
};

export default ObraSocialModel;
