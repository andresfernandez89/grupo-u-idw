import { EspecialidadModel } from '../models/especialidad.js'

export class EspecialidadesService {
  async update(id, { nombre, activo }) {
    const existente = await EspecialidadModel.findById(id)
    if (!existente) return null
    await EspecialidadModel.update(id, { nombre, activo })
    return EspecialidadModel.findById(id)
  }
}
