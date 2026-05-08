import { body, param } from "express-validator";

export const getByIdEspecialidadValidator = [
  param("id")
    .trim()
    .isInt({ min: 1 })
    .withMessage("El id debe ser un entero positivo")
    .toInt(),
];

export const createEspecialidadValidator = [
  body("nombre")
    .exists()
    .trim()
    .withMessage("El campo nombre es obligatorio")
    .notEmpty()
    .withMessage("El nombre no puede estar vacío")
    .isString()
    .withMessage("El nombre debe ser un texto")
    .isLength({ max: 120 })
    .withMessage("El nombre no puede superar 120 caracteres"),
];

export const updateEspecialidadValidator = [
  param("id")
    .trim()
    .isInt({ min: 1 })
    .toInt()
    .withMessage("El id debe ser un entero positivo"),

  body("nombre")
    .trim()
    .notEmpty()
    .withMessage("El nombre es requerido")
    .isString()
    .withMessage("El nombre debe ser un texto")
    .isLength({ max: 120 })
    .withMessage("El nombre no puede superar 120 caracteres"),

  body("activo").isIn([0, 1]).withMessage("activo debe ser 0 o 1"),
];

export const deleteEspecialidadValidator = [
  param("id")
    .exists()
    .trim()
    .withMessage("El parámetro id es obligatorio")
    .isInt({ min: 1 })
    .withMessage("El id debe ser un entero positivo")
    .toInt(),
];
