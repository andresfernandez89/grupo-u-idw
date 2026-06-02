import swaggerJsdoc from "swagger-jsdoc";

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
        url: "http://localhost:3000/api/v1",
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
      },
    },
  },
  apis: ["./src/routes/**/*.js"],
};

const specs = swaggerJsdoc(options);

export default specs;
