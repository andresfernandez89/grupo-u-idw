import swaggerJsdoc from "swagger-jsdoc";

const port = process.env.PORT || 3000;
const swaggerServerUrl =
  process.env.SWAGGER_SERVER_URL || `http://localhost:${port}/api/v1`;

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Clínica API",
      version: "1.0.0",
      description: "API REST para sistema de gestión de clínica médica",
    },
    servers: [
      {
        url: swaggerServerUrl,
        description: "Servidor de desarrollo",
      },
    ],
    components: {
      schemas: {
        Especialidad: {
          type: "object",
          properties: {
            id: { type: "integer", description: "ID de la especialidad" },
            nombre: {
              type: "string",
              description: "Nombre de la especialidad",
            },
            activo: { type: "boolean", description: "Indica si está activa" },
          },
        },
        EspecialidadCreate: {
          type: "object",
          required: ["nombre"],
          properties: {
            nombre: {
              type: "string",
              description: "Nombre de la especialidad",
              maxLength: 120,
            },
          },
        },
        Medico: {
          type: "object",
          properties: {
            id: { type: "integer", description: "ID del médico" },
            id_usuario: {
              type: "integer",
              description: "ID del usuario asociado",
            },
            id_especialidad: {
              type: "integer",
              description: "ID de la especialidad",
            },
            especialidad: {
              type: "string",
              description: "Nombre de la especialidad",
            },
            matricula: { type: "integer", description: "Número de matrícula" },
            descripcion: {
              type: "string",
              nullable: true,
              description: "Descripción o notas del médico",
            },
            valor_consulta: {
              type: "number",
              format: "float",
              description: "Valor de la consulta",
            },
            apellido: { type: "string", description: "Apellido del médico" },
            nombres: { type: "string", description: "Nombres del médico" },
            email: {
              type: "string",
              format: "email",
              description: "Email del médico",
            },
            foto_path: {
              type: "string",
              nullable: true,
              description: "Ruta de la foto del médico",
            },
          },
        },
        MedicoCreate: {
          type: "object",
          required: [
            "id_usuario",
            "id_especialidad",
            "matricula",
            "valor_consulta",
          ],
          properties: {
            id_usuario: {
              type: "integer",
              description: "ID del usuario a vincular",
              minimum: 1,
            },
            id_especialidad: {
              type: "integer",
              description: "ID de la especialidad",
              minimum: 1,
            },
            matricula: {
              type: "integer",
              description: "Número de matrícula",
              minimum: 1,
            },
            descripcion: {
              type: "string",
              nullable: true,
              description: "Descripción o notas del médico",
            },
            valor_consulta: {
              type: "number",
              format: "float",
              description: "Valor de la consulta",
              minimum: 0,
            },
          },
        },
        Paciente: {
          type: "object",
          properties: {
            id: { type: "integer", description: "ID del paciente" },
            id_usuario: {
              type: "integer",
              description: "ID del usuario asociado",
            },
            apellido: { type: "string", description: "Apellido del paciente" },
            nombres: { type: "string", description: "Nombres del paciente" },
            email: {
              type: "string",
              format: "email",
              description: "Email del paciente",
            },
            foto_path: {
              type: "string",
              nullable: true,
              description: "Ruta de la foto del paciente",
            },
            obra_social: {
              type: "object",
              properties: {
                id: { type: "integer", description: "ID de la obra social" },
                descripcion: {
                  type: "string",
                  description: "Nombre de la obra social",
                },
              },
            },
          },
        },
        PacienteCreate: {
          type: "object",
          required: ["id_usuario", "id_obra_social"],
          properties: {
            id_usuario: {
              type: "integer",
              description: "ID del usuario a vincular",
              minimum: 1,
            },
            id_obra_social: {
              type: "integer",
              description: "ID de la obra social",
              minimum: 1,
            },
          },
        },
        ObraSocial: {
          type: "object",
          properties: {
            id: { type: "integer", description: "ID de la obra social" },
            nombre: {
              type: "string",
              description: "Nombre de la obra social",
            },
            descripcion: {
              type: "string",
              nullable: true,
              description: "Descripción de la obra social",
            },
            porcentaje_descuento: {
              type: "number",
              format: "float",
              description: "Porcentaje de descuento aplicado",
            },
            es_particular: {
              type: "boolean",
              description: "Indica si corresponde a atención particular",
            },
          },
        },
        ObraSocialInput: {
          type: "object",
          required: ["nombre", "porcentaje_descuento", "es_particular"],
          properties: {
            nombre: {
              type: "string",
              description: "Nombre de la obra social",
              maxLength: 120,
            },
            descripcion: {
              type: "string",
              nullable: true,
              description: "Descripción de la obra social",
              maxLength: 255,
            },
            porcentaje_descuento: {
              type: "number",
              format: "float",
              description: "Porcentaje de descuento",
              minimum: 0,
              maximum: 100,
            },
            es_particular: {
              type: "boolean",
              description: "Indica si corresponde a atención particular",
            },
          },
        },
        Error: {
          type: "object",
          properties: {
            success: { type: "boolean" },
            message: { type: "string" },
          },
        },
        Paginacion: {
          type: "object",
          properties: {
            page: { type: "integer" },
            limit: { type: "integer" },
            total: { type: "integer" },
            totalPages: { type: "integer" },
          },
        },
        Turno: {
          type: "object",
          properties: {
            id: { type: "integer", description: "ID del turno" },
            id_medico: {
              type: "integer",
              description: "ID del médico asignado",
            },
            id_paciente: {
              type: "integer",
              description: "ID del paciente",
            },
            id_obra_social: {
              type: "integer",
              description: "ID de la obra social",
            },
            fecha_hora: {
              type: "string",
              format: "date-time",
              description: "Fecha y hora del turno",
            },
            valor_total: {
              type: "number",
              format: "float",
              description: "Valor total calculado de la consulta",
            },
            atendido: {
              type: "boolean",
              description: "Indica si el turno ya fue atendido",
            },
            activo: {
              type: "boolean",
              description: "Indica si el turno está activo",
            },
          },
        },
        EstadisticaPorObraSocial: {
          type: "object",
          properties: {
            id_obra_social: { type: "integer", description: "ID de la obra social" },
            obra_social: { type: "string", description: "Nombre de la obra social" },
            es_particular: { type: "boolean", description: "Indica si corresponde a atención particular" },
            total_turnos: { type: "integer", description: "Total de turnos registrados" },
            turnos_atendidos: { type: "integer", description: "Turnos efectivamente atendidos" },
            turnos_pendientes: { type: "integer", description: "Turnos aún no atendidos" },
            ingresos_realizados: { type: "number", format: "float", description: "Suma de valor_total de turnos atendidos" },
            porcentaje_atencion: { type: "number", format: "float", description: "Porcentaje de turnos atendidos sobre el total" },
          },
        },
        TurnoCreate: {
          type: "object",
          required: ["id_medico", "id_paciente", "id_obra_social", "fecha_hora"],
          properties: {
            id_medico: {
              type: "integer",
              description: "ID del médico",
              minimum: 1,
            },
            id_paciente: {
              type: "integer",
              description: "ID del paciente",
              minimum: 1,
            },
            id_obra_social: {
              type: "integer",
              description: "ID de la obra social",
              minimum: 1,
            },
            fecha_hora: {
              type: "string",
              format: "date-time",
              description: "Fecha y hora del turno (ISO 8601)",
            },
          },
        },
      },
    },
  },
  apis: ["./src/routes/**/*.js"],
};

const specs = swaggerJsdoc(options);

export default specs;
