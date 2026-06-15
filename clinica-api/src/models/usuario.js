import crypto from "crypto";
import { pool } from "../config/db.js";

function hashContrasenia(contrasenia) {
  return crypto.createHash("sha256").update(contrasenia).digest("hex");
}

const UsuarioModel = {
  async findUsuarios({ filters, limit, offset, sort, order }) {
    let sql =
      "SELECT id_usuario, documento, apellido, nombres, email, foto_path, rol, activo FROM usuarios WHERE activo = 1";
    const params = [];

    if (filters.documento) {
      sql += " AND documento = ?";
      params.push(filters.documento);
    }

    if (filters.apellido) {
      sql += " AND apellido = ?";
      params.push(filters.apellido);
    }

    if (filters.nombres) {
      sql += " AND nombres = ?";
      params.push(filters.nombres);
    }

    if (filters.email) {
      sql += " AND email = ?";
      params.push(filters.email);
    }

    if (filters.rol) {
      sql += " AND rol = ?";
      params.push(filters.rol);
    }

    sql += ` ORDER BY ${sort} ${order}`;
    sql += " LIMIT ? OFFSET ?";
    params.push(limit, offset);

    const [rows] = await pool.query(sql, params);
    return rows;
  },

  async countUsuarios({ filters }) {
    let sql = "SELECT COUNT(*) AS total FROM usuarios WHERE activo = 1";
    const params = [];

    if (filters.documento) {
      sql += " AND documento = ?";
      params.push(filters.documento);
    }

    if (filters.apellido) {
      sql += " AND apellido = ?";
      params.push(filters.apellido);
    }

    if (filters.nombres) {
      sql += " AND nombres = ?";
      params.push(filters.nombres);
    }

    if (filters.email) {
      sql += " AND email = ?";
      params.push(filters.email);
    }

    if (filters.rol) {
      sql += " AND rol = ?";
      params.push(filters.rol);
    }

    const [rows] = await pool.query(sql, params);
    return rows[0].total;
  },

  async findById(id) {
    const [rows] = await pool.query(
      "SELECT id_usuario, documento, apellido, nombres, email, foto_path, rol, activo FROM usuarios WHERE id_usuario = ? AND activo = 1",
      [id],
    );
    return rows[0] ?? null;
  },

  async findByEmail(email) {
    const [rows] = await pool.query(
      "SELECT id_usuario, documento, apellido, nombres, email, foto_path, rol, activo FROM usuarios WHERE email = ?",
      [email],
    );
    return rows[0] ?? null;
  },

  async findByEmailYPassword(email, contrasenia) {
    const [rows] = await pool.query(
      `SELECT id_usuario, documento, apellido, nombres, email, foto_path, rol, activo
       FROM usuarios
       WHERE email = ?
         AND contrasenia = SHA2(?, 256)
         AND activo = 1`,
      [email, contrasenia],
    );
    return rows[0] ?? null;
  },

  async findByDocumento(documento) {
    const [rows] = await pool.query(
      "SELECT id_usuario, documento, apellido, nombres, email, foto_path, rol, activo FROM usuarios WHERE documento = ?",
      [documento],
    );
    return rows[0] ?? null;
  },

  async create({ documento, apellido, nombres, email, contrasenia, foto_path, rol }) {
    const [result] = await pool.query(
      "INSERT INTO usuarios (documento, apellido, nombres, email, contrasenia, foto_path, rol, activo) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
      [documento, apellido, nombres, email, hashContrasenia(contrasenia), foto_path || "", rol, 1],
    );
    return {
      id_usuario: result.insertId,
      documento,
      apellido,
      nombres,
      email,
      foto_path: foto_path || "",
      rol,
      activo: 1,
    };
  },

  async update(id, { documento, apellido, nombres, email, contrasenia, foto_path, rol }) {
    const [result] = await pool.query(
      `UPDATE usuarios
       SET documento = ?, apellido = ?, nombres = ?, email = ?, contrasenia = ?, foto_path = ?, rol = ?
       WHERE id_usuario = ? AND activo = 1`,
      [documento, apellido, nombres, email, hashContrasenia(contrasenia), foto_path || "", rol, id],
    );
    return result.affectedRows;
  },

  async reactivate(id, { documento, apellido, nombres, email, contrasenia, foto_path, rol }) {
    const [result] = await pool.query(
      `UPDATE usuarios
       SET activo = 1, documento = ?, apellido = ?, nombres = ?, email = ?, contrasenia = ?, foto_path = ?, rol = ?
       WHERE id_usuario = ?`,
      [documento, apellido, nombres, email, hashContrasenia(contrasenia), foto_path || "", rol, id],
    );
    return result.affectedRows;
  },

  async delete(id) {
    const [result] = await pool.query(
      "UPDATE usuarios SET activo = 0 WHERE id_usuario = ? AND activo = 1",
      [id],
    );
    return result.affectedRows;
  },
};

export default UsuarioModel;
