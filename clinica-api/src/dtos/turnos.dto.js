function normalizeFechaHora(fechaHora) {
  if (!fechaHora) return fechaHora;
  return fechaHora.trim().replace(/\.\d{3}Z$/, "Z");
}

export function turnoCreate(body) {
  return {
    id_medico: parseInt(body?.id_medico, 10),
    id_paciente: parseInt(body?.id_paciente, 10),
    id_obra_social: parseInt(body?.id_obra_social, 10),
    fecha_hora: normalizeFechaHora(body?.fecha_hora),
  };
}

export function turnoResponse(t) {
  if (!t) return null;

  return {
    id: t.id_turno_reserva,
    id_medico: t.id_medico,
    id_paciente: t.id_paciente,
    id_obra_social: t.id_obra_social,
    fecha_hora: t.fecha_hora,
    valor_total: t.valor_total !== null ? parseFloat(t.valor_total) : null,
    atendido: t.atendido === 1,
    activo: t.activo === 1,
  };
}
