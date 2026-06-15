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
    .isIn(["id_turno_reserva", "fecha_hora", "valor_total", "atendido", "id_medico", "id_paciente"])
    .withMessage(
      "sort debe ser id_turno_reserva, fecha_hora, valor_total, atendido, id_medico o id_paciente",
    ),

  query("order")
    .optional()
    .toLowerCase()
    .isIn(["asc", "desc"])
    .withMessage("order debe ser asc o desc"),
];

export const browseTurnoValidator = [
  query("id_medico")
    .optional()
    .isInt({ min: 1 })
    .withMessage("id_medico debe ser un entero positivo")
    .toInt(),

  query("id_paciente")
    .optional()
    .isInt({ min: 1 })
    .withMessage("id_paciente debe ser un entero positivo")
    .toInt(),

  query("id_obra_social")
    .optional()
    .isInt({ min: 1 })
    .withMessage("id_obra_social debe ser un entero positivo")
    .toInt(),

  query("atendido").optional().isIn(["0", "1"]).withMessage("atendido debe ser 0 o 1").toInt(),

  query("fecha_desde")
    .optional()
    .trim()
    .isISO8601()
    .withMessage("fecha_desde debe tener un formato de fecha válido"),

  query("fecha_hasta")
    .optional()
    .trim()
    .isISO8601()
    .withMessage("fecha_hasta debe tener un formato de fecha válido"),

  ...paginationValidators,
];

export const getByIdTurnoValidator = [
  param("id").trim().isInt({ min: 1 }).withMessage("El id debe ser un entero positivo").toInt(),
];

export const createTurnoValidator = [
  body("id_medico")
    .notEmpty()
    .withMessage("id_medico es obligatorio")
    .bail()
    .isInt({ min: 1 })
    .withMessage("id_medico debe ser un entero positivo")
    .toInt(),

  body("id_paciente")
    .notEmpty()
    .withMessage("id_paciente es obligatorio")
    .bail()
    .isInt({ min: 1 })
    .withMessage("id_paciente debe ser un entero positivo")
    .toInt(),

  body("id_obra_social")
    .notEmpty()
    .withMessage("id_obra_social es obligatorio")
    .bail()
    .isInt({ min: 1 })
    .withMessage("id_obra_social debe ser un entero positivo")
    .toInt(),

  body("fecha_hora")
    .notEmpty()
    .withMessage("fecha_hora es obligatoria")
    .bail()
    .trim()
    .isISO8601()
    .withMessage("fecha_hora debe tener un formato de fecha y hora válido (ISO 8601)"),
];

export const updateTurnoValidator = [
  param("id").trim().isInt({ min: 1 }).withMessage("El id debe ser un entero positivo").toInt(),

  body("id_medico")
    .notEmpty()
    .withMessage("id_medico es obligatorio")
    .bail()
    .isInt({ min: 1 })
    .withMessage("id_medico debe ser un entero positivo")
    .toInt(),

  body("id_paciente")
    .notEmpty()
    .withMessage("id_paciente es obligatorio")
    .bail()
    .isInt({ min: 1 })
    .withMessage("id_paciente debe ser un entero positivo")
    .toInt(),

  body("id_obra_social")
    .notEmpty()
    .withMessage("id_obra_social es obligatorio")
    .bail()
    .isInt({ min: 1 })
    .withMessage("id_obra_social debe ser un entero positivo")
    .toInt(),

  body("fecha_hora")
    .notEmpty()
    .withMessage("fecha_hora es obligatoria")
    .bail()
    .trim()
    .isISO8601()
    .withMessage("fecha_hora debe tener un formato de fecha y hora válido (ISO 8601)"),
];

export const deleteTurnoValidator = [
  param("id").trim().isInt({ min: 1 }).withMessage("El id debe ser un entero positivo").toInt(),
];

export const marcarAtendidoValidator = [
  param("id").trim().isInt({ min: 1 }).withMessage("El id debe ser un entero positivo").toInt(),
];
