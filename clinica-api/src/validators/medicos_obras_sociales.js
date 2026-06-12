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
    .isIn(["id_medico_obra_social", "id_medico", "id_obra_social"])
    .withMessage("sort debe ser id_medico_obra_social, id_medico o id_obra_social"),

  query("order")
    .optional()
    .toLowerCase()
    .isIn(["asc", "desc"])
    .withMessage("order debe ser asc o desc"),
];

export const browseMedicoObraSocialValidator = [
  query("id_medico")
    .optional()
    .isInt({ min: 1 })
    .withMessage("id_medico debe ser un entero positivo")
    .toInt(),

  query("id_obra_social")
    .optional()
    .isInt({ min: 1 })
    .withMessage("id_obra_social debe ser un entero positivo")
    .toInt(),

  ...paginationValidators,
];

export const createMedicoObraSocialValidator = [
  body("id_medico")
    .trim()
    .notEmpty()
    .withMessage("El id_medico es obligatorio")
    .bail()
    .isInt({ min: 1 })
    .withMessage("El id_medico debe ser un entero positivo")
    .toInt(),

  body("id_obra_social")
    .trim()
    .notEmpty()
    .withMessage("El id_obra_social es obligatorio")
    .bail()
    .isInt({ min: 1 })
    .withMessage("El id_obra_social debe ser un entero positivo")
    .toInt(),
];

export const updateMedicoObraSocialValidator = [
  param("id")
    .trim()
    .isInt({ min: 1 })
    .withMessage("El id debe ser un entero positivo")
    .toInt(),

  body("id_medico")
    .trim()
    .notEmpty()
    .withMessage("El id_medico es obligatorio")
    .bail()
    .isInt({ min: 1 })
    .withMessage("El id_medico debe ser un entero positivo")
    .toInt(),

  body("id_obra_social")
    .trim()
    .notEmpty()
    .withMessage("El id_obra_social es obligatorio")
    .bail()
    .isInt({ min: 1 })
    .withMessage("El id_obra_social debe ser un entero positivo")
    .toInt(),
];

export const deleteMedicoObraSocialValidator = [
  param("id_medico")
    .trim()
    .isInt({ min: 1 })
    .withMessage("El id_medico debe ser un entero positivo")
    .toInt(),

  param("id_obra_social")
    .trim()
    .isInt({ min: 1 })
    .withMessage("El id_obra_social debe ser un entero positivo")
    .toInt(),
];

export const getByIdMedicoObraSocialValidator = [
  param("id")
    .trim()
    .isInt({ min: 1 })
    .withMessage("El id debe ser un entero positivo")
    .toInt(),
];
