import authService from "../services/auth.js";

export class AuthController {
  async login(req, res) {
    try {
      const token = authService.generateToken(req.user);

      return res.status(200).json({
        success: true,
        message: "Inicio de sesión exitoso",
        data: {
          token,
          usuario: {
            id: req.user.id_usuario,
            email: req.user.email,
            apellido: req.user.apellido,
            nombres: req.user.nombres,
            rol: req.user.rol,
          },
        },
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }
}

export default new AuthController();
