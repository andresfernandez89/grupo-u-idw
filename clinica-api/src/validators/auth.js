import { body } from "express-validator";

export const loginValidator = [
  body("email")
    .notEmpty()
    .withMessage("El email es obligatorio")
    .bail()
    .isEmail()
    .withMessage("El email no es válido")
    .normalizeEmail(),

  body("contrasenia")
    .notEmpty()
    .withMessage("La contraseña es obligatoria")
    .isString()
    .withMessage("La contraseña debe ser un texto"),
];
