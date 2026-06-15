import { DuplicateError } from "../utils/errors.js";
import { usuariosCreate, usuariosResponse } from "../dtos/usuarios.dto.js";
import usuarioService from "../services/usuarios.js";

export class UsuariosController {
  async browse(req, res) {
    try {
      const filters = {};
      const page = parseInt(req.query.page) || 1;
      const limit = Math.min(parseInt(req.query.limit) || 10, 100);
      const sort = req.query.sort;
      const order = req.query.order;

      if (req.query.documento) filters.documento = req.query.documento;
      if (req.query.apellido) filters.apellido = req.query.apellido;
      if (req.query.nombres) filters.nombres = req.query.nombres;
      if (req.query.email) filters.email = req.query.email;
      if (req.query.rol) filters.rol = req.query.rol;

      const resultado = await usuarioService.browse({
        filters,
        sort,
        order,
        page,
        limit,
      });

      res.json({
        success: true,
        data: resultado.data.map(usuariosResponse),
        pagination: resultado.pagination,
      });
    } catch (err) {
      res.status(500).json({ success: false, message: err.message });
    }
  }

  async findById(req, res) {
    try {
      const { id } = req.params;
      const usuarioEncontrado = await usuarioService.readById(id);

      res.json(usuariosResponse(usuarioEncontrado));
    } catch (error) {
      if (error instanceof NotFoundError) {
        return res.status(404).json({ success: false, message: error.message });
      }
      res.status(500).json({ success: false, message: error.message });
    }
  }

  async create(req, res) {
    try {
      const datos = usuariosCreate(req.body, req.file);
      const nuevoUsuario = await usuarioService.create(datos);

      return res.status(201).json({
        success: true,
        message: "Usuario creado exitosamente",
        data: usuariosResponse(nuevoUsuario),
      });
    } catch (error) {
      if (error instanceof DuplicateError) {
        return res.status(409).json({ success: false, message: error.message });
      }

      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }

  async update(req, res) {
    try {
      const { id } = req.params;
      const datos = usuariosCreate(req.body, req.file);
      const actualizado = await usuarioService.update(id, datos);

      return res.status(200).json({
        success: true,
        message: "Usuario modificado exitosamente",
        data: usuariosResponse(actualizado),
      });
    } catch (err) {
      if (err instanceof NotFoundError) {
        return res.status(404).json({ success: false, message: err.message });
      }
      if (err instanceof DuplicateError) {
        return res.status(409).json({ success: false, message: err.message });
      }

      return res.status(500).json({
        success: false,
        message: err.message,
      });
    }
  }

  async delete(req, res) {
    try {
      const { id } = req.params;
      const deleted = await usuarioService.delete(id);

      if (!deleted) {
        return res.status(500).json({
          success: false,
          message: "Error al eliminar el usuario",
        });
      }

      return res.status(204).send();
    } catch (error) {
      if (error instanceof NotFoundError) {
        return res.status(404).json({ success: false, message: error.message });
      }
      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }
}

export default new UsuariosController();
