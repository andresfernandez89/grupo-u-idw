import EstadisticaModel from "../models/estadistica.js";

export class EstadisticasService {
  async porObraSocial({ fecha_desde, fecha_hasta } = {}) {
    return await EstadisticaModel.porObraSocial({ fecha_desde, fecha_hasta });
  }
}

export default new EstadisticasService();
