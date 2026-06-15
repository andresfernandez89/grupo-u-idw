export function medicoObraSocialCreate(body) {
  return {
    id_medico: body?.id_medico,
    id_obra_social: body?.id_obra_social,
  };
}

export function medicoObraSocialResponse(mos) {
  if (!mos) return null;

  return {
    id: mos.id_medico_obra_social,
    id_medico: mos.id_medico,
    medico_apellido: mos.medico_apellido,
    medico_nombres: mos.medico_nombres,
    id_obra_social: mos.id_obra_social,
    obra_social_nombre: mos.obra_social_nombre,
    activo: mos.activo,
  };
}
