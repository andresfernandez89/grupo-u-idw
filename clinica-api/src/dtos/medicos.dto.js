export function medicosResponse(medico) {
  if (!medico) return null;

  return {
    id: medico.id_medico,
    id_usuario: medico.id_usuario,
    id_especialidad: medico.id_especialidad,
    especialidad: medico.especialidad,
    matricula: medico.matricula,
    descripcion: medico.descripcion,
    valor_consulta: parseFloat(medico.valor_consulta),
    apellido: medico.apellido,
    nombres: medico.nombres,
    email: medico.email,
    foto_path: medico.foto_path,
  };
}

export function medicosCreate(body) {
  return {
    id_usuario: body?.id_usuario,
    id_especialidad: body?.id_especialidad,
    matricula: body?.matricula,
    descripcion: body?.descripcion?.trim() || null,
    valor_consulta: parseFloat(body?.valor_consulta),
  };
}
