# Trabajo Final Integrador — Grupo U

## Integrantes

- Gracimar Perez Morgado
- Maria Teresa Pereyra Potel
- Andres Alejandro Fernandez
- Cristopher Yang

---

## Descripción

API REST para la gestión de turnos médicos de una clínica. Permite registrar usuarios, médicos, pacientes, especialidades, obras sociales, gestionar la relación médico-obra social y reservar turnos.

Construida con **Node.js**, **Express 5**, **MySQL**, **Passport** (JWT/Local), **Swagger**, **Helmet**, **CORS**, **Morgan** y **PDFKit**.

---

## Instalación

```bash
# 1. Entrar a la carpeta del proyecto
cd clinica-api

# 2. Instalar dependencias
npm install

# 3. Ejecutar los stored procedures; al utilizar este comando, te va a solicitar que ingreses la password de tu DB
mysql -u {tu_DB_USER} -p {tu_DB_NAME} < database/stored_procedures.sql

# 4. Copiar el archivo de variables de entorno y completarlo
cp .env.example .env

# 5. Iniciar el servidor en desarrollo (recarga automática con --watch)
npm run dev

# O iniciar en modo producción
npm start

# Formatear el código con Prettier
npm run format
```

---

## Variables de entorno

El archivo `.env.example` contiene todas las variables necesarias con valores de ejemplo.

```env
# Server
PORT=3000
NODE_ENV=development

# Documentación Swagger
# Si no se define, defaultea a: http://localhost:{PORT}/api/v1
SWAGGER_SERVER_URL=http://localhost:3000/api/v1

# Database
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=tu_password
DB_NAME=prog3_turnos

# CORS
CORS_ORIGIN=http://localhost:3000

# JWT
JWT_SECRET=una_clave_secreta
```

---

## Estructura del proyecto

```
clinica-api/
├── server.js               # Punto de entrada: valida env, conecta a la DB y levanta el servidor
├── app.js                  # Crea y configura la app Express (middlewares, rutas, Swagger)
├── package.json            # Dependencias y scripts del proyecto
├── .env.example            # Ejemplos de variables de entorno requeridas
├── .prettierrc             # Configuración de formateo de código
├── .prettierignore         # Archivos que Prettier debe ignorar
├── .gitignore              # Archivos ignorados por Git
│
└── src/
    ├── config/             # Configuración de servicios externos y librerías
    │   ├── db.js           #   Conexión a la base de datos MySQL
    │   ├── multer.js       #   Configuración para subir archivos
    │   ├── swagger.js      #   Configuración de la documentación de la API
    │   ├── passport.js     #   Estrategias de autenticación JWT y Local
    │   └── cache.js        #   Configuración de caché (apicache)
    │
    ├── middlewares/        # Funciones que se ejecutan antes de llegar al controlador
    │   ├── auth.js         #   Verifica el token JWT usando Passport
    │   ├── role.js         #   Verifica que el usuario tenga el rol requerido (1=médico, 2=paciente, 3=admin)
    │   └── validacion.js   #   Atrapa errores de express-validator y responde 400
    │
    ├── routes/             # Define las URLs disponibles y las conecta con los controladores
    │   └── v1/             #   Versión 1 de la API
    │       ├── index.js    #     Agrupa todas las rutas y las exporta al app.js
    │       ├── auth.js
    │       ├── especialidades.js
    │       ├── medicos.js
    │       ├── medicos_obras_sociales.js
    │       ├── obras_sociales.js
    │       ├── pacientes.js
    │       ├── turnos.js
    │       ├── estadisticas.js
    │       └── usuarios.js
    │
    ├── controllers/        # Recibe el request HTTP, valida la entrada y devuelve la respuesta
    │   ├── auth.js
    │   ├── especialidades.js
    │   ├── medicos.js
    │   ├── medicos_obras_sociales.js
    │   ├── obras_sociales.js
    │   ├── pacientes.js
    │   ├── turnos.js
    │   ├── estadisticas.js
    │   └── usuarios.js
    │
    ├── services/           # Contiene la lógica de negocio. Llama a los modelos y procesa datos
    │   ├── auth.js
    │   ├── especialidades.js
    │   ├── medicos.js
    │   ├── medicos_obras_sociales.js
    │   ├── obras_sociales.js
    │   ├── pacientes.js
    │   ├── turnos.js
    │   ├── estadisticas.js
    │   └── usuarios.js
    │
    ├── models/             # Acceso a la base de datos. Aquí van las queries SQL
    │   ├── usuario.js
    │   ├── medico.js
    │   ├── medico_obra_social.js
    │   ├── paciente.js
    │   ├── turno.js
    │   ├── especialidad.js
    │   ├── obra_social.js
    │   └── estadistica.js
    │
    ├── validators/         # Reglas de validación de los datos que llegan en el request (express-validator)
    │   ├── auth.js
    │   ├── especialidades.js
    │   ├── medicos.js
    │   ├── medicos_obras_sociales.js
    │   ├── obras_sociales.js
    │   ├── pacientes.js
    │   ├── turnos.js
    │   ├── estadisticas.js
    │   └── usuarios.js
    │
    ├── dtos/               # Data Transfer Objects. Transforman datos entre la capa HTTP y el dominio
    │   ├── especialidades.dto.js
    │   ├── medicos.dto.js
    │   ├── medicos_obras_sociales.dto.js
    │   ├── obras_sociales.dto.js
    │   ├── pacientes.dto.js
    │   ├── turnos.dto.js
    │   ├── estadisticas.dto.js
    │   └── usuarios.dto.js
    │
    └── utils/              # Funciones auxiliares reutilizables en cualquier parte del proyecto
        ├── errors.js       #   Manejo centralizado de errores
        └── pdf.js          #   Generación de documentos PDF
```

---

## Flujo de una petición HTTP

Así viaja una petición desde que llega al servidor hasta que se responde:

```
Request HTTP
    │
    ▼
routes/         → define la URL y aplica middlewares (auth, role, validators)
    │
    ▼
middlewares/    → verifica token JWT vía Passport y permisos del rol
    │
    ▼
controllers/    → recibe req y res, delega la lógica al servicio
    │
    ▼
services/       → aplica reglas de negocio, llama al modelo
    │
    ▼
models/         → ejecuta la query SQL contra la base de datos
    │
    ▼
Response HTTP
```

---

## Documentación de la API

La API cuenta con documentación interactiva generada con Swagger. Una vez levantado el servidor, accedé a:

```
http://localhost:{PORT}/api/v1/api-docs
```

Allí podés ver todos los endpoints, schemas, parámetros y probar los requests directamente.

---

## Endpoints principales

| Recurso                | Ruta base                        |
| ---------------------- | -------------------------------- |
| Autenticación          | `/api/v1/auth`                   |
| Especialidades         | `/api/v1/especialidades`         |
| Médicos                | `/api/v1/medicos`                |
| Obras sociales         | `/api/v1/obras-sociales`         |
| Médicos-Obras sociales | `/api/v1/medicos-obras-sociales` |
| Pacientes              | `/api/v1/pacientes`              |
| Turnos                 | `/api/v1/turnos`                 |
| Estadísticas           | `/api/v1/estadisticas`           |
| Usuarios               | `/api/v1/usuarios`               |

### Exportación de estadísticas a PDF

Los siguientes endpoints devuelven un archivo PDF descargable:

- `GET /api/v1/estadisticas/por-obra-social/pdf`
- `GET /api/v1/estadisticas/por-medico/pdf`
- `GET /api/v1/estadisticas/por-especialidad/pdf`
- `GET /api/v1/estadisticas/resumen-general/pdf`

---

## Roles de usuario

| Rol           | Valor numérico |
| ------------- | -------------- |
| Médico        | `1`            |
| Paciente      | `2`            |
| Administrador | `3`            |
