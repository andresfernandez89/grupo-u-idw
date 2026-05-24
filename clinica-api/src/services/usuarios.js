import UsuarioModel from "../models/usuario.js";

export class UsuariosService {
  async browse({
    filters = {},
    page = 1,
    limit = 10,
    sort = "id_usuario",
    order = "asc",
  }) {
    const offset = (page - 1) * limit;
    const allowedSort = [
      "id_usuario",
      "apellido",
      "nombres",
      "email",
      "documento",
      "rol",
    ].includes(sort)
      ? sort
      : "id_usuario";
    const allowedOrder = ["asc", "desc"].includes(order?.toLowerCase())
      ? order.toLowerCase()
      : "asc";

    const rows = await UsuarioModel.findUsuarios({
      filters,
      limit,
      offset,
      sort: allowedSort,
      order: allowedOrder,
    });

    const total = await UsuarioModel.countUsuarios({ filters });

    return {
      data: rows,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async readById(id) {
    return await UsuarioModel.findById(id);
  }

  async create({ documento, apellido, nombres, email, contrasenia, foto_path, rol }) {
    const emailExistente = await UsuarioModel.findByEmail(email);
    if (emailExistente) {
      throw new Error("El email ya está registrado");
    }

    const docExistente = await UsuarioModel.findByDocumento(documento);
    if (docExistente) {
      throw new Error("El documento ya está registrado");
    }

    return await UsuarioModel.create({
      documento,
      apellido,
      nombres,
      email,
      contrasenia,
      foto_path,
      rol,
    });
  }

  async update(id, { documento, apellido, nombres, email, contrasenia, foto_path, rol }) {
    if (email) {
      const emailExistente = await UsuarioModel.findByEmail(email);
      if (emailExistente && emailExistente.id_usuario !== id) {
        throw new Error("El email ya está registrado por otro usuario");
      }
    }

    if (documento) {
      const docExistente = await UsuarioModel.findByDocumento(documento);
      if (docExistente && docExistente.id_usuario !== id) {
        throw new Error("El documento ya está registrado por otro usuario");
      }
    }

    const affectedRows = await UsuarioModel.update(id, {
      documento,
      apellido,
      nombres,
      email,
      contrasenia,
      foto_path,
      rol,
    });

    if (affectedRows === 0) {
      return null;
    }

    return UsuarioModel.findById(id);
  }

}

export default new UsuariosService();
