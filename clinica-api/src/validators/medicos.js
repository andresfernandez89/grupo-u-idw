import { body, param } from "express-validator";

export const getByEspecialidadMedicoValidator = [
  param("id_especialidad")
    .trim()
    .isInt({ min: 1 })
    .withMessage("El id de especialidad debe ser un entero positivo")
    .toInt(),
];

export const getByIdMedicoValidator = [
  param("id")
    .trim()
    .isInt({ min: 1 })
    .withMessage("El id debe ser un entero positivo")
    .toInt(),
];

export const createMedicoValidator = [
  body("id_usuario")
    .trim()
    .notEmpty()
    .withMessage("El id_usuario es obligatorio")
    .bail()
    .isInt({ min: 1 })
    .withMessage("El id_usuario debe ser un entero positivo")
    .toInt(),

  body("id_especialidad")
    .trim()
    .notEmpty()
    .withMessage("El id_especialidad es obligatorio")
    .bail()
    .isInt({ min: 1 })
    .withMessage("El id_especialidad debe ser un entero positivo")
    .toInt(),

  body("matricula")
    .trim()
    .notEmpty()
    .withMessage("La matrícula es obligatoria")
    .bail()
    .isInt({ min: 1 })
    .withMessage("La matrícula debe ser un entero positivo")
    .toInt(),

  body("descripcion")
    .optional()
    .trim()
    .isString()
    .withMessage("La descripción debe ser un texto"),

  body("valor_consulta")
    .trim()
    .notEmpty()
    .withMessage("El valor_consulta es obligatorio")
    .bail()
    .isDecimal()
    .withMessage("El valor de consulta debe ser un número decimal válido")
    .bail()
    .custom((value) => parseFloat(value) >= 0)
    .withMessage("El valor de consulta debe ser mayor o igual a 0"),
];

export const updateMedicoValidator = [
  param("id")
    .trim()
    .isInt({ min: 1 })
    .toInt()
    .withMessage("El id debe ser un entero positivo"),

  body("id_usuario")
    .optional()
    .isInt({ min: 1 })
    .withMessage("El id_usuario debe ser un entero positivo")
    .toInt(),

  body("id_especialidad")
    .optional()
    .isInt({ min: 1 })
    .withMessage("El id_especialidad debe ser un entero positivo")
    .toInt(),

  body("matricula")
    .optional()
    .isInt({ min: 1 })
    .withMessage("La matrícula debe ser un entero positivo")
    .toInt(),

  body("descripcion")
    .optional()
    .trim()
    .isString()
    .withMessage("La descripción debe ser un texto"),

  body("valor_consulta")
    .optional()
    .isDecimal()
    .withMessage("El valor de consulta debe ser un número decimal válido")
    .custom((value) => parseFloat(value) >= 0)
    .withMessage("El valor de consulta debe ser mayor o igual a 0"),
];

export const deleteMedicoValidator = [
  param("id")
    .trim()
    .isInt({ min: 1 })
    .withMessage("El id debe ser un entero positivo")
    .toInt(),
];
