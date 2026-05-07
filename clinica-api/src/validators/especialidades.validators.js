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

export const deleteEspecialidadValidator = [
  param("id")
    .exists()
    .withMessage("El parámetro id es obligatorio")
    .isInt({ min: 1 })
    .withMessage("El id debe ser un entero positivo")
    .toInt(),
];
