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
      `SELECT id_obra_social, nombre, descripcion, porcentaje_descuento, es_particular
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
    return { id_obra_social: result.insertId, nombre, descripcion, porcentaje_descuento, es_particular };
  },

  async update(id, { nombre, descripcion, porcentaje_descuento, es_particular }) {
    const [result] = await pool.query(
      `UPDATE obras_sociales
       SET nombre = ?, descripcion = ?, porcentaje_descuento = ?, es_particular = ?
       WHERE id_obra_social = ? AND activo = 1`,
      [nombre, descripcion, porcentaje_descuento, es_particular, id],
    );
    return result.affectedRows;
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
