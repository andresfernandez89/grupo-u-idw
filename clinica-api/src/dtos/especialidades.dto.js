export function especialidadesResponse(especialidad) {
  if (!especialidad) return null;

  return {
    id: especialidad.id_especialidad,
    nombre: especialidad.nombre,
    activo: especialidad.activo === 1,
  };
}

export function especialidadesCreate(body) {
  return {
    nombre: body?.nombre?.trim(),
  };
}
