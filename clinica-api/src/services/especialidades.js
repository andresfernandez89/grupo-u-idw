import { EspecialidadModel } from '../models/especialidad.js'

export class EspecialidadesService {
  async update(id, nombre) {
    const existente = await EspecialidadModel.findById(id)
    if (!existente) return null
    await EspecialidadModel.update(id, nombre)
    return await EspecialidadModel.findById(id)
  }
}
