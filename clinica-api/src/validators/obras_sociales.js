import { body, param, query } from "express-validator";

const paginationValidators = [
  query("page").optional().isInt({ min: 1 }).withMessage("page debe ser un entero >= 1").toInt(),

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

export const createObraSocialValidator = [
  body("nombre")
    .trim()
    .notEmpty()
    .withMessage("El nombre es obligatorio")
    .bail()
    .isString()
    .withMessage("El nombre debe ser un texto")
    .isLength({ max: 120 })
    .withMessage("El nombre no puede superar 120 caracteres"),

  body("descripcion")
    .optional()
    .trim()
    .isString()
    .withMessage("La descripción debe ser un texto")
    .isLength({ max: 255 })
    .withMessage("La descripción no puede superar 255 caracteres"),

  body("porcentaje_descuento")
    .trim()
    .notEmpty()
    .withMessage("El porcentaje_descuento es obligatorio")
    .bail()
    .isDecimal()
    .withMessage("El porcentaje_descuento debe ser un número decimal")
    .bail()
    .custom((v) => parseFloat(v) >= 0 && parseFloat(v) <= 100)
    .withMessage("El porcentaje_descuento debe estar entre 0 y 100"),

  body("es_particular")
    .notEmpty()
    .withMessage("es_particular es obligatorio")
    .bail()
    .isBoolean()
    .withMessage("es_particular debe ser un booleano (true o false)")
    .toBoolean(),
];

export const updateObraSocialValidator = [
  param("id").trim().isInt({ min: 1 }).withMessage("El id debe ser un entero positivo").toInt(),

  body("nombre")
    .trim()
    .notEmpty()
    .withMessage("El nombre es obligatorio")
    .bail()
    .isString()
    .withMessage("El nombre debe ser un texto")
    .isLength({ max: 120 })
    .withMessage("El nombre no puede superar 120 caracteres"),

  body("descripcion")
    .optional()
    .trim()
    .isString()
    .withMessage("La descripción debe ser un texto")
    .isLength({ max: 255 })
    .withMessage("La descripción no puede superar 255 caracteres"),

  body("porcentaje_descuento")
    .trim()
    .notEmpty()
    .withMessage("El porcentaje_descuento es obligatorio")
    .bail()
    .isDecimal()
    .withMessage("El porcentaje_descuento debe ser un número decimal")
    .bail()
    .custom((v) => parseFloat(v) >= 0 && parseFloat(v) <= 100)
    .withMessage("El porcentaje_descuento debe estar entre 0 y 100"),

  body("es_particular")
    .notEmpty()
    .withMessage("es_particular es obligatorio")
    .bail()
    .isBoolean()
    .withMessage("es_particular debe ser un booleano (true o false)")
    .toBoolean(),
];

export const deleteObraSocialValidator = [
  param("id").trim().isInt({ min: 1 }).withMessage("El id debe ser un entero positivo").toInt(),
];

export const getMedicosObraSocialValidator = [
  param("id").trim().isInt({ min: 1 }).withMessage("El id debe ser un entero positivo").toInt(),

  ...paginationValidators,
];

export const getByIdObraSocialValidator = [
  param("id").trim().isInt({ min: 1 }).withMessage("El id debe ser un entero positivo").toInt(),
];
