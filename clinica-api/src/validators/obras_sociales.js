import { param, query } from "express-validator";

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
    .isIn(["id_obra_social", "nombre", "porcentaje_descuento"])
    .withMessage("sort debe ser id_obra_social, nombre o porcentaje_descuento"),

  query("order")
    .optional()
    .toLowerCase()
    .isIn(["asc", "desc"])
    .withMessage("order debe ser asc o desc"),
];

export const browseObraSocialValidator = [
  query("nombre")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("El nombre no puede estar vacío")
    .bail()
    .isString()
    .withMessage("El nombre debe ser un texto")
    .isLength({ max: 120 })
    .withMessage("El nombre no puede superar 120 caracteres"),

  query("es_particular")
    .optional()
    .isInt({ min: 0, max: 1 })
    .withMessage("es_particular debe ser 0 o 1")
    .toInt(),

  ...paginationValidators,
];

export const getByIdObraSocialValidator = [
  param("id")
    .trim()
    .isInt({ min: 1 })
    .withMessage("El id debe ser un entero positivo")
    .toInt(),
];
