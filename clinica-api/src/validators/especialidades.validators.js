import { check } from "express-validator";

export const createEspecialidadValidator = [
  check("nombre")
    .exists()
    .withMessage("El campo nombre es obligatorio")
    .notEmpty()
    .withMessage("El nombre no puede estar vacío")
    .isString()
    .withMessage("El nombre debe ser un texto")
    .isLength({ max: 120 })
    .withMessage("El nombre no puede superar 120 caracteres")
    .trim(),
];
