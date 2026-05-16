import { pool } from "../config/db.js";

const MedicoModel = {
  async findMedicos() {
    const [rows] = await pool.query(
      `SELECT m.id_medico, m.id_usuario, m.id_especialidad, m.matricula,
              m.descripcion, m.valor_consulta,
              e.nombre AS especialidad,
              u.apellido, u.nombres, u.email, u.foto_path
       FROM medicos m
       JOIN especialidades e ON m.id_especialidad = e.id_especialidad
       JOIN usuarios u ON m.id_usuario = u.id_usuario
       WHERE u.activo = 1`,
    );
    return rows;
  },

  async findById(id) {
    const [rows] = await pool.query(
      `SELECT m.id_medico, m.id_usuario, m.id_especialidad, m.matricula,
              m.descripcion, m.valor_consulta,
              e.nombre AS especialidad,
              u.apellido, u.nombres, u.email, u.foto_path
       FROM medicos m
       JOIN especialidades e ON m.id_especialidad = e.id_especialidad
       JOIN usuarios u ON m.id_usuario = u.id_usuario
       WHERE m.id_medico = ? AND u.activo = 1`,
      [id],
    );
    return rows[0] ?? null;
  },

  async findByEspecialidad(id_especialidad) {
    const [rows] = await pool.query(
      `SELECT m.id_medico, m.id_usuario, m.id_especialidad, m.matricula,
              m.descripcion, m.valor_consulta,
              e.nombre AS especialidad,
              u.apellido, u.nombres, u.email, u.foto_path
       FROM medicos m
       JOIN especialidades e ON m.id_especialidad = e.id_especialidad
       JOIN usuarios u ON m.id_usuario = u.id_usuario
       WHERE m.id_especialidad = ? AND u.activo = 1`,
      [id_especialidad],
    );
    return rows;
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
    await pool.query(
      `UPDATE medicos
       SET id_usuario = ?, id_especialidad = ?, matricula = ?, descripcion = ?, valor_consulta = ?
       WHERE id_medico = ?`,
      [id_usuario, id_especialidad, matricula, descripcion, valor_consulta, id],
    );
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
