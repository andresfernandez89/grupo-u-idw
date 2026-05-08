# Trabajo Final Integrador — Grupo U

## Integrantes

- Gracimar Perez Morgado
- Maria Teresa Pereyra Potel
- Andres Alejandro Fernandez
- Cristopher Yang

---

## Descripción

API REST para la gestión de turnos médicos de una clínica. Permite registrar pacientes, médicos, especialidades, obras sociales y reservar turnos. Construida con **Node.js**, **Express 5** y **MySQL**.

---

## Instalación

```bash
# 1. Entrar a la carpeta del proyecto
cd clinica-api

# 2. Instalar dependencias
npm install

# 3. Copiar el archivo de variables de entorno y completarlo
cp .env.example .env

# 4. Iniciar el servidor
npm start
```

---

## Variables de entorno

El archivo `.env.example` contiene todas las variables necesarias con valores de ejemplo.

```
PORT=3000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=tu_password
DB_NAME=prog3_turnos
JWT_SECRET=una_clave_secreta
```

---

## Estructura del proyecto

```
clinica-api/
├── app.js                  # Punto de entrada: crea el servidor Express y registra las rutas
├── package.json            # Dependencias y scripts del proyecto
├── .env.example            # Ejemplos de variables de entorno requeridas
├── .prettierrc             # Configuración de formateo de código
│
└── src/
    ├── config/             # Configuración de servicios externos y librerías
    │   ├── db.js           #   Conexión a la base de datos MySQL
    │   ├── multer.js       #   Configuración para subir archivos
    │   └── swagger.js      #   Configuración de la documentación de la API
    │
    ├── middlewares/        # Funciones que se ejecutan antes de llegar al controlador
    │   ├── auth.js         #   Verifica que el token JWT sea válido
    │   ├── role.js         #   Verifica que el usuario tenga el rol requerido (1=médico, 2=paciente, 3=admin)
    │   └── validacion.js   #   Atrapa errores de express-validator y responde 400
    │
    ├── routes/             # Define las URLs disponibles y las conecta con los controladores
    │   └── v1/             #   Versión 1 de la API
    │       ├── index.js    #     Agrupa todas las rutas y las exporta al app.js
    │       ├── auth.js
    │       ├── especialidades.js
    │       ├── medicos.js
    │       ├── obras_sociales.js
    │       ├── pacientes.js
    │       ├── turnos.js
    │       └── estadisticas.js
    │
    ├── controllers/        # Recibe el request HTTP, valida la entrada y devuelve la respuesta
    │   ├── auth.js
    │   ├── especialidades.js
    │   ├── medicos.js
    │   ├── obras_sociales.js
    │   ├── pacientes.js
    │   ├── turnos.js
    │   └── estadisticas.js
    │
    ├── services/           # Contiene la lógica de negocio. Llama a los modelos y procesa datos
    │   ├── auth.js
    │   ├── especialidades.js
    │   ├── medicos.js
    │   ├── obras_sociales.js
    │   ├── pacientes.js
    │   ├── turnos.js
    │   └── estadisticas.js
    │
    ├── models/             # Acceso a la base de datos. Aquí van las queries SQL
    │   ├── usuario.js
    │   ├── medico.js
    │   ├── paciente.js
    │   ├── turno.js
    │   ├── especialidad.js
    │   ├── obra_social.js
    │   └── estadistica.js
    │
    ├── validators/         # Reglas de validación de los datos que llegan en el request (express-validator)
    │   └── especialidades.js
    │
    ├── dtos/               # Data Transfer Objects. Transforman datos entre la capa HTTP y el dominio
    │   └── especialidades.dto.js
    │
    └── utils/              # Funciones auxiliares reutilizables en cualquier parte del proyecto
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
middlewares/    → verifica token JWT y permisos del rol
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

## Roles de usuario

| Rol | Valor numérico |
|-----|---------------|
| Médico | `1` |
| Paciente | `2` |
| Administrador | `3` |

---
