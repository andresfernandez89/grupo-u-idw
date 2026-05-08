import { body, check, param, validationResult } from "express-validator";

export const createEspecialidadValidator = [
  check("nombre")
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
    .isInt({ min: 1 })
    .withMessage("El id debe ser un entero positivo"),

  body("nombre")
    .trim()
    .notEmpty()
    .withMessage("El nombre es requerido")
    .isLength({ max: 120 })
    .withMessage("El nombre no puede superar 120 caracteres"),

  body("activo").isIn([0, 1]).withMessage("activo debe ser 0 o 1"),

  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(400).json({ errors: errors.array() });
    next();
  },
];

export const deleteEspecialidadValidator = [
  param("id")
    .exists()
    .withMessage("El parámetro id es obligatorio")
    .isInt({ min: 1 })
    .withMessage("El id debe ser un entero positivo")
    .toInt(),
];
