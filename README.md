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
├── .env.example            # Variables de entorno requeridas (plantilla sin valores reales)
├── logs/                   # Archivos de log generados en tiempo de ejecución (Morgan)
│
└── src/
    ├── config/             # Configuración de servicios externos y librerías
    │   ├── db.js           #   Conexión a la base de datos MySQL (pool de conexiones)
    │   ├── multer.js       #   Configuración para subir archivos (fotos de perfil)
    │   └── swagger.js      #   Configuración de la documentación automática de la API
    │
    ├── routes/             # Define las URLs disponibles y las conecta con los controladores
    │   ├── index.js
    │   ├── auth.js
    │   ├── medicos.js
    │   ├── pacientes.js
    │   ├── turnos.js
    │   ├── especialidades.js
    │   ├── obras_sociales.js
    │   └── estadisticas.js
    │
    ├── controllers/        # Recibe el request HTTP, llama al servicio y devuelve la respuesta
    │   ├── auth.js
    │   ├── medicos.js
    │   ├── pacientes.js
    │   ├── turnos.js
    │   ├── especialidades.js
    │   ├── obras_sociales.js
    │   └── estadisticas.js
    │
    ├── services/           # Contiene la lógica de negocio. Llama a los modelos y procesa datos
    │   ├── auth.js
    │   ├── medicos.js
    │   ├── pacientes.js
    │   ├── turnos.js
    │   ├── especialidades.js
    │   ├── obras_sociales.js
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
    ├── middlewares/        # Funciones que se ejecutan antes de llegar al controlador
    │   ├── auth.js         #   Verifica que el token JWT sea válido
    │   └── role.js         #   Verifica que el usuario tenga el rol requerido (1=médico, 2=paciente, 3=admin)
    │
    ├── validators/         # Reglas de validación de los datos que llegan en el request (express-validator)
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
