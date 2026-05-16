import MedicoModel from "../models/medico.js";

export class MedicosService {
  async browse() {
    return await MedicoModel.findMedicos();
  }

  async findByEspecialidad(id_especialidad) {
    return await MedicoModel.findByEspecialidad(id_especialidad);
  }

  async readById(id) {
    return await MedicoModel.findById(id);
  }

  async create({
    id_usuario,
    id_especialidad,
    matricula,
    descripcion,
    valor_consulta,
  }) {
    const existing = await MedicoModel.findByMatricula(matricula);
    if (existing) {
      throw new Error("La matrícula ya está registrada");
    }
    return await MedicoModel.create({
      id_usuario,
      id_especialidad,
      matricula,
      descripcion,
      valor_consulta,
    });
  }

  async update(
    id,
    { id_usuario, id_especialidad, matricula, descripcion, valor_consulta },
  ) {
    const existing = await MedicoModel.findById(id);
    if (!existing) return null;

    const isMatriculaExist = await MedicoModel.findByMatricula(matricula);
    if (isMatriculaExist && isMatriculaExist.id_medico !== id) {
      throw new Error("La matrícula ya está registrada por otro médico");
    }

    await MedicoModel.update(id, {
      id_usuario,
      id_especialidad,
      matricula,
      descripcion,
      valor_consulta,
    });

    return MedicoModel.findById(id);
  }

  async delete(id) {
    const existing = await MedicoModel.findById(id);
    if (!existing) {
      return null;
    }
    const affectedRows = await MedicoModel.delete(existing.id_usuario);
    return affectedRows === 1;
  }
}

export default new MedicosService();
