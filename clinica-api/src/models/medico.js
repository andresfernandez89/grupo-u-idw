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

  async findByIdUsuario(id_usuario) {
    const [rows] = await pool.query(
      `SELECT m.id_medico, m.id_usuario, m.id_especialidad, m.matricula,
              m.descripcion, m.valor_consulta, u.activo
       FROM medicos m
       JOIN usuarios u ON m.id_usuario = u.id_usuario
       WHERE m.id_usuario = ?`,
      [id_usuario],
    );
    return rows[0] ?? null;
  },

  async findByMatricula(matricula) {
    // Unimos (JOIN) medicos con usuarios para leer el campo "activo". La matrícula no se repite y vive en "medicos", pero la marca de borrado (activo) está en "usuarios". Necesitamos saber si una matrícula repetida es de un médico activo (es duplicado) o de uno borrado (se puede revivir). Usamos las tablas reales y NO la vista v_medicos, porque la vista esconde los borrados.
    const [rows] = await pool.query(
      `SELECT m.id_medico, m.id_usuario, m.id_especialidad, m.matricula,
              m.descripcion, m.valor_consulta, u.activo
       FROM medicos m
       JOIN usuarios u ON m.id_usuario = u.id_usuario
       WHERE m.matricula = ?`,
      [matricula],
    );
    return rows[0] ?? null;
  },

  async create({ id_usuario, id_especialidad, matricula, descripcion, valor_consulta }) {
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

  async update(id, { id_usuario, id_especialidad, matricula, descripcion, valor_consulta }) {
    // Guarda defensiva: solo actualiza si el usuario asociado está activo,
    // para no mutar un médico soft-deleted.
    const [result] = await pool.query(
      `UPDATE medicos m
       JOIN usuarios u ON m.id_usuario = u.id_usuario
       SET m.id_usuario = ?, m.id_especialidad = ?, m.matricula = ?, m.descripcion = ?, m.valor_consulta = ?
       WHERE m.id_medico = ? AND u.activo = 1`,
      [id_usuario, id_especialidad, matricula, descripcion, valor_consulta, id],
    );
    return result.affectedRows;
  },

  async reactivate(
    conn,
    { id_medico, id_usuario, id_especialidad, matricula, descripcion, valor_consulta },
  ) {
    // Reactiva el usuario ya asociado a esa matrícula (id_usuario NO cambia, ADR-001)
    // y sobrescribe los campos del médico. Debe correr dentro de una transacción.
    await conn.query("UPDATE usuarios SET activo = 1 WHERE id_usuario = ?", [id_usuario]);
    await conn.query(
      `UPDATE medicos
       SET id_especialidad = ?, matricula = ?, descripcion = ?, valor_consulta = ?
       WHERE id_medico = ?`,
      [id_especialidad, matricula, descripcion, valor_consulta, id_medico],
    );
  },

  async findObrasSociales(id_medico, { limit, offset, sort, order }) {
    let sql = `SELECT mos.id_medico_obra_social, mos.id_medico, mos.id_obra_social, mos.activo,
                      v.apellido AS medico_apellido, v.nombres AS medico_nombres,
                      os.nombre AS obra_social_nombre
               FROM medicos_obras_sociales mos
               JOIN v_medicos v ON mos.id_medico = v.id_medico
               JOIN obras_sociales os ON mos.id_obra_social = os.id_obra_social
               WHERE mos.id_medico = ? AND mos.activo = 1 AND os.activo = 1`;
    const params = [id_medico];

    sql += ` ORDER BY ${sort} ${order}`;
    sql += " LIMIT ? OFFSET ?";
    params.push(limit, offset);

    const [rows] = await pool.query(sql, params);
    return rows;
  },

  async countObrasSociales(id_medico) {
    const [rows] = await pool.query(
      `SELECT COUNT(*) AS total
       FROM medicos_obras_sociales mos
       JOIN obras_sociales os ON mos.id_obra_social = os.id_obra_social
       WHERE mos.id_medico = ? AND mos.activo = 1 AND os.activo = 1`,
      [id_medico],
    );
    return rows[0].total;
  },

  async delete(id_usuario) {
    const [result] = await pool.query(
      "UPDATE usuarios SET activo = 0 WHERE id_usuario = ? AND activo = 1",
      [id_usuario],
    );

    await pool.query(
      `UPDATE medicos_obras_sociales mos
       JOIN medicos m ON mos.id_medico = m.id_medico
       SET mos.activo = 0
       WHERE m.id_usuario = ? AND mos.activo = 1`,
      [id_usuario],
    );

    return result.affectedRows;
  },
};

export default MedicoModel;
