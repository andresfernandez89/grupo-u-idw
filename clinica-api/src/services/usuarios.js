import { DuplicateError } from "../utils/errors.js";
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

  async create({ documento, apellido, nombres, email, contrasenia, foto_path }) {
    const ROL_PACIENTE = 2;

    const emailExistente = await UsuarioModel.findByEmail(email);
    if (emailExistente?.activo === 1) {
      throw new DuplicateError("El email ya está registrado");
    }

    const docExistente = await UsuarioModel.findByDocumento(documento);
    if (docExistente?.activo === 1) {
      throw new DuplicateError("El documento ya está registrado");
    }

    // ADR-001 Opción C: reactivar registro soft-deleted (documento tiene prioridad).
    // El rol siempre se fuerza a paciente (2), independientemente del rol anterior.
    const registroInactivo = docExistente ?? emailExistente;
    if (registroInactivo) {
      await UsuarioModel.reactivate(registroInactivo.id_usuario, {
        documento,
        apellido,
        nombres,
        email,
        contrasenia,
        foto_path,
        rol: ROL_PACIENTE,
      });
      return await UsuarioModel.findById(registroInactivo.id_usuario);
    }

    return await UsuarioModel.create({
      documento,
      apellido,
      nombres,
      email,
      contrasenia,
      foto_path,
      rol: ROL_PACIENTE,
    });
  }

  async update(id, { documento, apellido, nombres, email, contrasenia, foto_path, rol }) {
    const emailExistente = await UsuarioModel.findByEmail(email);
    if (emailExistente && emailExistente.id_usuario !== id) {
      throw new DuplicateError("El email ya está registrado por otro usuario");
    }

    const docExistente = await UsuarioModel.findByDocumento(documento);
    if (docExistente && docExistente.id_usuario !== id) {
      throw new DuplicateError("El documento ya está registrado por otro usuario");
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

  async delete(id) {
    const existing = await UsuarioModel.findById(id);
    if (!existing) {
      return null;
    }
    const affectedRows = await UsuarioModel.delete(id);
    return affectedRows === 1;
  }
}

export default new UsuariosService();
