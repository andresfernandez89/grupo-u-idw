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
