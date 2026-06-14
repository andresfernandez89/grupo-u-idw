import { ExtractJwt, Strategy as JwtStrategy } from "passport-jwt";
import { Strategy as LocalStrategy } from "passport-local";
import UsuarioModel from "../models/usuario.js";

const JWT_SECRET = process.env.JWT_SECRET || "clave-secreta-desarrollo";

export const localStrategy = new LocalStrategy(
  {
    usernameField: "email",
    passwordField: "contrasenia",
  },
  async (email, contrasenia, done) => {
    try {
      const usuario = await UsuarioModel.findByEmailYPassword(
        email,
        contrasenia,
      );

      if (!usuario) {
        return done(null, false, {
          message: "Usuario o contraseña incorrectos",
        });
      }

      return done(null, usuario);
    } catch (err) {
      return done(err);
    }
  },
);

export const jwtStrategy = new JwtStrategy(
  {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: JWT_SECRET,
  },
  async (payload, done) => {
    try {
      const usuario = await UsuarioModel.findById(payload.id_usuario);

      if (!usuario) {
        return done(null, false);
      }

      return done(null, usuario);
    } catch (err) {
      return done(err);
    }
  },
);

export { JWT_SECRET };
