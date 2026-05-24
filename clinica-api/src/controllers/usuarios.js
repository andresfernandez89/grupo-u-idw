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
      res.status(500).json({ message: err.message });
    }
  }

  async findById(req, res) {
    try {
      const { id } = req.params;
      const usuarioEncontrado = await usuarioService.readById(id);

      if (!usuarioEncontrado) {
        return res.status(404).json({
          message: "No se encontró usuario con el id solicitado",
        });
      }
      res.json(usuariosResponse(usuarioEncontrado));
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  async create(req, res) {
    try {
      const datos = usuariosCreate(req.body);
      const nuevoUsuario = await usuarioService.create(datos);

      return res.status(201).json({
        success: true,
        message: "Usuario creado exitosamente",
        data: usuariosResponse(nuevoUsuario),
      });
    } catch (error) {
      if (
        error.message.includes("ya está registrado")
      ) {
        return res.status(409).json({ success: false, message: error.message });
      }

      return res.status(500).json({
        success: false,
        error: error.message,
      });
    }
  }


}

export default new UsuariosController();
