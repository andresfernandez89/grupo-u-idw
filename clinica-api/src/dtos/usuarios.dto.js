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
