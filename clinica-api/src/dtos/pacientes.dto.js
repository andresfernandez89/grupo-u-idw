export function pacienteCreate(body) {
  return {
    id_usuario: parseInt(body?.id_usuario, 10),
    id_obra_social: parseInt(body?.id_obra_social, 10),
  };
}

export function pacienteResponse(p) {
  if (!p) return null;

  return {
    id: p.id_paciente,
    id_usuario: p.id_usuario,
    apellido: p.apellido,
    nombres: p.nombres,
    email: p.email,
    foto_path: p.foto_path,
    obra_social: {
      id: p.id_obra_social,
      descripcion: p.descripcion_obra_social,
    },
  };
}
