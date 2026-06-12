import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../config/passport.js";

export class AuthService {
  generateToken(usuario) {
    const payload = {
      id_usuario: usuario.id_usuario,
      email: usuario.email,
      rol: usuario.rol,
    };

    return jwt.sign(payload, JWT_SECRET, { expiresIn: "1h" });
  }
}

export default new AuthService();
