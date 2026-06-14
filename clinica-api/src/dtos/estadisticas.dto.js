export function estadisticaObraSocialResponse(row) {
  if (!row) return null;

  return {
    id_obra_social: row.id_obra_social,
    obra_social: row.obra_social,
    es_particular: Boolean(row.es_particular),
    total_turnos: row.total_turnos,
    turnos_atendidos: parseInt(row.turnos_atendidos),
    turnos_pendientes: parseInt(row.turnos_pendientes),
    ingresos_realizados: parseFloat(row.ingresos_realizados),
    porcentaje_atencion: parseFloat(row.porcentaje_atencion),
  };
}

export function estadisticaPorMedicoResponse(row) {
  if (!row) return null;

  return {
    id_medico: row.id_medico,
    medico: row.medico,
    especialidad: row.especialidad,
    total_turnos: row.total_turnos,
    turnos_atendidos: parseInt(row.turnos_atendidos),
    turnos_pendientes: parseInt(row.turnos_pendientes),
    ingresos_realizados: parseFloat(row.ingresos_realizados),
    porcentaje_atencion: parseFloat(row.porcentaje_atencion),
  };
}

export function estadisticaPorEspecialidadResponse(row) {
  if (!row) return null;

  return {
    id_especialidad: row.id_especialidad,
    especialidad: row.especialidad,
    total_medicos: parseInt(row.total_medicos),
    total_turnos: row.total_turnos,
    turnos_atendidos: parseInt(row.turnos_atendidos),
    turnos_pendientes: parseInt(row.turnos_pendientes),
    ingresos_realizados: parseFloat(row.ingresos_realizados),
    porcentaje_atencion: parseFloat(row.porcentaje_atencion),
  };
}

export function resumenGeneralTurnosResponse(row) {
  if (!row) return null;

  return {
    total_turnos: row.total_turnos,
    turnos_atendidos: parseInt(row.turnos_atendidos),
    turnos_pendientes: parseInt(row.turnos_pendientes),
    ingresos_realizados: parseFloat(row.ingresos_realizados),
    porcentaje_atencion: parseFloat(row.porcentaje_atencion),
    total_pacientes: parseInt(row.total_pacientes),
    total_medicos: parseInt(row.total_medicos),
    total_obras_sociales: parseInt(row.total_obras_sociales),
  };
}
