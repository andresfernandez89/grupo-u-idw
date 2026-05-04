import { param, body, validationResult } from "express-validator";

export const validarActualizarEspecialidad = [
  param("id")
    .isInt({ min: 1 })
    .withMessage("El id debe ser un entero positivo"),

  body("nombre")
    .trim()
    .notEmpty()
    .withMessage("El nombre es requerido")
    .isLength({ max: 120 })
    .withMessage("El nombre no puede superar 120 caracteres"),

  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(400).json({ errors: errors.array() });
    next();
  },
];
