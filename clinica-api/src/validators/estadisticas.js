import { query } from "express-validator";

const fechaRangoValidator = [
  query("fecha_desde")
    .optional()
    .trim()
    .isISO8601()
    .withMessage(
      "fecha_desde debe tener un formato de fecha válido (ISO 8601)",
    ),
  query("fecha_hasta")
    .optional()
    .trim()
    .isISO8601()
    .withMessage(
      "fecha_hasta debe tener un formato de fecha válido (ISO 8601)",
    ),
];

export const porObraSocialValidator = fechaRangoValidator;
export const porMedicoValidator = fechaRangoValidator;
export const porEspecialidadValidator = fechaRangoValidator;
export const resumenGeneralValidator = fechaRangoValidator;
