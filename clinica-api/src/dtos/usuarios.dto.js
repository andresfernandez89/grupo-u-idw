export function usuariosResponse(usuario) {
  if (!usuario) return null;

  return {
    id: usuario.id_usuario,
    documento: usuario.documento,
    apellido: usuario.apellido,
    nombres: usuario.nombres,
    email: usuario.email,
    foto_path: usuario.foto_path,
    rol: usuario.rol,
    activo: usuario.activo === 1,
  };
}

export function usuariosCreate(body) {
  return {
    documento: body?.documento?.trim(),
    apellido: body?.apellido?.trim(),
    nombres: body?.nombres?.trim(),
    email: body?.email?.trim(),
    contrasenia: body?.contrasenia,
    foto_path: body?.foto_path?.trim() || '',
    rol: body?.rol,
  };
}
