import { body, param, query } from "express-validator";

export const browseUsuariosValidator = [
  query("documento")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("El documento no puede estar vacío")
    .bail()
    .isString()
    .withMessage("El documento debe ser un texto")
    .isLength({ max: 20 })
    .withMessage("El documento no puede superar 20 caracteres"),

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

  query("email")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("El email no puede estar vacío")
    .bail()
    .isEmail()
    .withMessage("Debe ser un email válido")
    .normalizeEmail(),

  query("rol")
    .optional()
    .isIn(["1", "2", "3"])
    .withMessage("rol debe ser 1 (médico), 2 (paciente) o 3 (admin)")
    .toInt(),

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
    .isIn(["id_usuario", "apellido", "nombres", "email", "documento", "rol"])
    .withMessage("sort debe ser id_usuario, apellido, nombres, email, documento o rol"),

  query("order")
    .optional()
    .toLowerCase()
    .isIn(["asc", "desc"])
    .withMessage("order debe ser asc o desc"),
];

export const getByIdUsuarioValidator = [
  param("id")
    .trim()
    .isInt({ min: 1 })
    .withMessage("El id debe ser un entero positivo")
    .toInt(),
];

export const createUsuarioValidator = [
  body("documento")
    .trim()
    .notEmpty()
    .withMessage("El documento es obligatorio")
    .bail()
    .isString()
    .withMessage("El documento debe ser un texto")
    .isLength({ max: 20 })
    .withMessage("El documento no puede superar 20 caracteres"),

  body("apellido")
    .trim()
    .notEmpty()
    .withMessage("El apellido es obligatorio")
    .bail()
    .isString()
    .withMessage("El apellido debe ser un texto")
    .isLength({ max: 100 })
    .withMessage("El apellido no puede superar 100 caracteres"),

  body("nombres")
    .trim()
    .notEmpty()
    .withMessage("Los nombres son obligatorios")
    .bail()
    .isString()
    .withMessage("Los nombres deben ser un texto")
    .isLength({ max: 100 })
    .withMessage("Los nombres no pueden superar 100 caracteres"),

  body("email")
    .trim()
    .notEmpty()
    .withMessage("El email es obligatorio")
    .bail()
    .isEmail()
    .withMessage("Debe ser un email válido")
    .normalizeEmail(),

  body("contrasenia")
    .trim()
    .notEmpty()
    .withMessage("La contraseña es obligatoria"),

  body("foto_path")
    .optional()
    .trim()
    .isString()
    .withMessage("La foto_path debe ser un texto"),

  body("rol")
    .trim()
    .notEmpty()
    .withMessage("El rol es obligatorio")
    .bail()
    .isIn([1, 2, 3])
    .withMessage("rol debe ser 1 (médico), 2 (paciente) o 3 (admin)"),
];

export const updateUsuarioValidator = [
  param("id")
    .trim()
    .isInt({ min: 1 })
    .toInt()
    .withMessage("El id debe ser un entero positivo"),

  body("documento")
    .trim()
    .notEmpty()
    .withMessage("El documento es obligatorio")
    .bail()
    .isString()
    .withMessage("El documento debe ser un texto")
    .isLength({ max: 20 })
    .withMessage("El documento no puede superar 20 caracteres"),

  body("apellido")
    .trim()
    .notEmpty()
    .withMessage("El apellido es obligatorio")
    .bail()
    .isString()
    .withMessage("El apellido debe ser un texto")
    .isLength({ max: 100 })
    .withMessage("El apellido no puede superar 100 caracteres"),

  body("nombres")
    .trim()
    .notEmpty()
    .withMessage("Los nombres son obligatorios")
    .bail()
    .isString()
    .withMessage("Los nombres deben ser un texto")
    .isLength({ max: 100 })
    .withMessage("Los nombres no pueden superar 100 caracteres"),

  body("email")
    .trim()
    .notEmpty()
    .withMessage("El email es obligatorio")
    .bail()
    .isEmail()
    .withMessage("Debe ser un email válido")
    .normalizeEmail(),

  body("contrasenia")
    .trim()
    .notEmpty()
    .withMessage("La contraseña es obligatoria"),

  body("foto_path")
    .optional()
    .trim()
    .isString()
    .withMessage("La foto_path debe ser un texto"),

  body("rol")
    .trim()
    .notEmpty()
    .withMessage("El rol es obligatorio")
    .bail()
    .isIn([1, 2, 3])
    .withMessage("rol debe ser 1 (médico), 2 (paciente) o 3 (admin)"),
];

export const deleteUsuarioValidator = [
  param("id")
    .trim()
    .isInt({ min: 1 })
    .withMessage("El id debe ser un entero positivo")
    .toInt(),
];
