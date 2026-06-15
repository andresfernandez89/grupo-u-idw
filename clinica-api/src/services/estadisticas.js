import EstadisticaModel from "../models/estadistica.js";

export class EstadisticasService {
  async porObraSocial({ fecha_desde, fecha_hasta } = {}) {
    return await EstadisticaModel.porObraSocial({ fecha_desde, fecha_hasta });
  }

  async porMedico({ fecha_desde, fecha_hasta } = {}) {
    return await EstadisticaModel.porMedico({ fecha_desde, fecha_hasta });
  }

  async porEspecialidad({ fecha_desde, fecha_hasta } = {}) {
    return await EstadisticaModel.porEspecialidad({ fecha_desde, fecha_hasta });
  }

  async resumenGeneral({ fecha_desde, fecha_hasta } = {}) {
    return await EstadisticaModel.resumenGeneral({ fecha_desde, fecha_hasta });
  }
}

export default new EstadisticasService();
