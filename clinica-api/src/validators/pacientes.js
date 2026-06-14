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
    .isIn(["id_paciente", "apellido", "nombres", "id_obra_social"])
    .withMessage(
      "sort debe ser id_paciente, apellido, nombres o id_obra_social",
    ),

  query("order")
    .optional()
    .toLowerCase()
    .isIn(["asc", "desc"])
    .withMessage("order debe ser asc o desc"),
];

export const browsePacienteValidator = [
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
    .withMessage("El nombre no puede estar vacío")
    .bail()
    .isString()
    .withMessage("El nombre debe ser un texto")
    .isLength({ max: 100 })
    .withMessage("El nombre no puede superar 100 caracteres"),

  query("id_obra_social")
    .optional()
    .isInt({ min: 1 })
    .withMessage("id_obra_social debe ser un entero positivo")
    .toInt(),

  ...paginationValidators,
];

export const getByIdPacienteValidator = [
  param("id")
    .trim()
    .isInt({ min: 1 })
    .withMessage("El id debe ser un entero positivo")
    .bail()
    .toInt(),
];

export const createPacienteValidator = [
  body("id_usuario")
    .notEmpty()
    .withMessage("id_usuario es obligatorio")
    .bail()
    .isInt({ min: 1 })
    .withMessage("id_usuario debe ser un entero positivo")
    .toInt(),

  body("id_obra_social")
    .notEmpty()
    .withMessage("id_obra_social es obligatorio")
    .bail()
    .isInt({ min: 1 })
    .withMessage("id_obra_social debe ser un entero positivo")
    .toInt(),
];

export const updatePacienteValidator = [
  param("id")
    .trim()
    .isInt({ min: 1 })
    .withMessage("El id debe ser un entero positivo")
    .bail()
    .toInt(),

  body("id_obra_social")
    .optional({ nullable: true })
    .isInt({ min: 1 })
    .withMessage("id_obra_social debe ser un entero positivo")
    .toInt(),
];

export const deletePacienteValidator = [
  param("id")
    .trim()
    .isInt({ min: 1 })
    .withMessage("El id debe ser un entero positivo")
    .bail()
    .toInt(),
];
