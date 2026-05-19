import { body, param, query } from "express-validator";

const paginationValidators = [
  query("page")
    .optional()
    .isInt({ min: 1 })
    .withMessage("page debe ser un entero >= 1")
    .toInt(),

  query("limit")
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage("limit debe ser entre 1 y 100")
    .toInt(),

  query("sort")
    .optional()
    .isIn(["id_medico", "matricula", "valor_consulta", "apellido", "nombres"])
    .withMessage("sort debe ser id_medico, matricula, valor_consulta, apellido o nombres"),

  query("order")
    .optional()
    .toLowerCase()
    .isIn(["asc", "desc"])
    .withMessage("order debe ser asc o desc"),
];

export const browseMedicoValidator = [
  query("id_especialidad")
    .optional()
    .isInt({ min: 1 })
    .withMessage("id_especialidad debe ser un entero positivo")
    .toInt(),

  query("matricula")
    .optional()
    .isInt({ min: 1 })
    .withMessage("matricula debe ser un entero positivo")
    .toInt(),

  query("apellido")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("El apellido no puede estar vacío")
    .bail()
    .isString()
    .withMessage("El apellido debe ser un texto")
    .isLength({ max: 100 })
    .withMessage("El apellido no puede superar 100 caracteres"),

  query("nombres")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("Los nombres no pueden estar vacíos")
    .bail()
    .isString()
    .withMessage("Los nombres deben ser un texto")
    .isLength({ max: 100 })
    .withMessage("Los nombres no pueden superar 100 caracteres"),

  ...paginationValidators,
];

export const getByEspecialidadMedicoValidator = [
  param("id_especialidad")
    .trim()
    .isInt({ min: 1 })
    .withMessage("El id de especialidad debe ser un entero positivo")
    .toInt(),

  query("matricula")
    .optional()
    .isInt({ min: 1 })
    .withMessage("matricula debe ser un entero positivo")
    .toInt(),

  query("apellido")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("El apellido no puede estar vacío")
    .bail()
    .isString()
    .withMessage("El apellido debe ser un texto")
    .isLength({ max: 100 })
    .withMessage("El apellido no puede superar 100 caracteres"),

  query("nombres")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("Los nombres no pueden estar vacíos")
    .bail()
    .isString()
    .withMessage("Los nombres deben ser un texto")
    .isLength({ max: 100 })
    .withMessage("Los nombres no pueden superar 100 caracteres"),

  ...paginationValidators,
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

export const deleteMedicoValidator = [
  param("id")
    .trim()
    .isInt({ min: 1 })
    .withMessage("El id debe ser un entero positivo")
    .toInt(),
];
