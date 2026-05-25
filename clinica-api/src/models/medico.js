import { pool } from "../config/db.js";

const MedicoModel = {
  async findMedicos({ filters, limit, offset, sort, order }) {
    let sql = `SELECT m.id_medico, m.id_usuario, m.id_especialidad, m.matricula,
                      m.descripcion, m.valor_consulta,
                      e.nombre AS especialidad,
                      v.apellido, v.nombres, v.email, v.foto_path
               FROM v_medicos v
               JOIN medicos m ON v.id_medico = m.id_medico
               JOIN especialidades e ON m.id_especialidad = e.id_especialidad
               WHERE 1=1`;
    const params = [];

    if (filters.id_especialidad) {
      sql += " AND m.id_especialidad = ?";
      params.push(filters.id_especialidad);
    }

    if (filters.matricula) {
      sql += " AND m.matricula = ?";
      params.push(filters.matricula);
    }

    if (filters.apellido) {
      sql += " AND v.apellido = ?";
      params.push(filters.apellido);
    }

    if (filters.nombres) {
      sql += " AND v.nombres = ?";
      params.push(filters.nombres);
    }

    sql += ` ORDER BY ${sort} ${order}`;
    sql += " LIMIT ? OFFSET ?";
    params.push(limit, offset);

    const [rows] = await pool.query(sql, params);
    return rows;
  },

  async countMedicos({ filters }) {
    let sql = `SELECT COUNT(*) AS total
               FROM v_medicos v
               JOIN medicos m ON v.id_medico = m.id_medico
               WHERE 1=1`;
    const params = [];

    if (filters.id_especialidad) {
      sql += " AND m.id_especialidad = ?";
      params.push(filters.id_especialidad);
    }

    if (filters.matricula) {
      sql += " AND m.matricula = ?";
      params.push(filters.matricula);
    }

    if (filters.apellido) {
      sql += " AND v.apellido = ?";
      params.push(filters.apellido);
    }

    if (filters.nombres) {
      sql += " AND v.nombres = ?";
      params.push(filters.nombres);
    }

    const [rows] = await pool.query(sql, params);
    return rows[0].total;
  },

  async findById(id) {
    const [rows] = await pool.query(
      `SELECT m.id_medico, m.id_usuario, m.id_especialidad, m.matricula,
              m.descripcion, m.valor_consulta,
              e.nombre AS especialidad,
              v.apellido, v.nombres, v.email, v.foto_path
       FROM v_medicos v
       JOIN medicos m ON v.id_medico = m.id_medico
       JOIN especialidades e ON m.id_especialidad = e.id_especialidad
       WHERE m.id_medico = ?`,
      [id],
    );
    return rows[0] ?? null;
  },

  async findByEspecialidad(id_especialidad, { filters, limit, offset, sort, order }) {
    let sql = `SELECT m.id_medico, m.id_usuario, m.id_especialidad, m.matricula,
                        m.descripcion, m.valor_consulta,
                        e.nombre AS especialidad,
                        v.apellido, v.nombres, v.email, v.foto_path
                 FROM v_medicos v
                 JOIN medicos m ON v.id_medico = m.id_medico
                 JOIN especialidades e ON m.id_especialidad = e.id_especialidad
                 WHERE m.id_especialidad = ?`;
    const params = [id_especialidad];

    if (filters.matricula) {
      sql += " AND m.matricula = ?";
      params.push(filters.matricula);
    }

    if (filters.apellido) {
      sql += " AND v.apellido = ?";
      params.push(filters.apellido);
    }

    if (filters.nombres) {
      sql += " AND v.nombres = ?";
      params.push(filters.nombres);
    }

    sql += ` ORDER BY ${sort} ${order}`;
    sql += " LIMIT ? OFFSET ?";
    params.push(limit, offset);

    const [rows] = await pool.query(sql, params);
    return rows;
  },

  async countByEspecialidad(id_especialidad, { filters }) {
    let sql = `SELECT COUNT(*) AS total
               FROM v_medicos v
               JOIN medicos m ON v.id_medico = m.id_medico
               WHERE m.id_especialidad = ?`;
    const params = [id_especialidad];

    if (filters.matricula) {
      sql += " AND m.matricula = ?";
      params.push(filters.matricula);
    }

    if (filters.apellido) {
      sql += " AND v.apellido = ?";
      params.push(filters.apellido);
    }

    if (filters.nombres) {
      sql += " AND v.nombres = ?";
      params.push(filters.nombres);
    }

    const [rows] = await pool.query(sql, params);
    return rows[0].total;
  },

  async findByMatricula(matricula) {
    const [rows] = await pool.query(
      "SELECT id_medico, id_usuario, id_especialidad, matricula, descripcion, valor_consulta FROM medicos WHERE matricula = ?",
      [matricula],
    );
    return rows[0] ?? null;
  },

  async create({
    id_usuario,
    id_especialidad,
    matricula,
    descripcion,
    valor_consulta,
  }) {
    const [result] = await pool.query(
      "INSERT INTO medicos (id_usuario, id_especialidad, matricula, descripcion, valor_consulta) VALUES (?, ?, ?, ?, ?)",
      [id_usuario, id_especialidad, matricula, descripcion, valor_consulta],
    );
    return {
      id_medico: result.insertId,
      id_usuario,
      id_especialidad,
      matricula,
      descripcion,
      valor_consulta,
    };
  },

  async update(
    id,
    { id_usuario, id_especialidad, matricula, descripcion, valor_consulta },
  ) {
    const [result] = await pool.query(
      `UPDATE medicos
       SET id_usuario = ?, id_especialidad = ?, matricula = ?, descripcion = ?, valor_consulta = ?
       WHERE id_medico = ?`,
      [id_usuario, id_especialidad, matricula, descripcion, valor_consulta, id],
    );
    return result.affectedRows;
  },

  async delete(id_usuario) {
    const [result] = await pool.query(
      "UPDATE usuarios SET activo = 0 WHERE id_usuario = ? AND activo = 1",
      [id_usuario],
    );
    return result.affectedRows;
  },
};

export default MedicoModel;
