# ADR-001: Comportamiento de CREATE frente a colisiones UNIQUE en contexto de soft-delete

- **Fecha:** 2026-05-25
- **Estado:** Aceptado
- **Autores:** Equipo grupo-u-idw

---

## Contexto

El enunciado del TP exige que los "delete" sean borrados lógicos: se utiliza el campo `activo`
para indicar si el registro está borrado o no, y **todos los registros que se busquen de la
base de datos deben cumplir `activo = 1`** (PDF p. 3).

El Administrador (ROL = 3) puede crear entidades: especialidades, obras sociales y asignar a usuarios sus respectivos roles (médico, paciente (por defecto),
administrador). El dump SQL provisto define columnas `UNIQUE` en varias tablas:

| Tabla            | Campo(s) UNIQUE      |
| ---------------- | -------------------- |
| `especialidades` | `nombre`             |
| `obras_sociales` | `nombre`             |
| `usuarios`       | `documento`, `email` |
| `medicos`        | `matricula`          |

El problema surge cuando el administrador intenta crear un recurso cuyo campo UNIQUE ya existe
en la base de datos pero en estado inactivo (`activo = 0`). Un `INSERT` directo genera un
`ER_DUP_ENTRY (1062)` de MySQL. La cuestión es: ¿qué debe hacer la API en ese caso?

---

## Fuerzas en juego

1. **Semántica del dominio:** Un registro con `activo = 0` fue eliminado. Desde la perspectiva
   del negocio, _ya no existe_. El admin que intenta "crearlo" de nuevo está actuando sobre
   algo que, en su modelo mental, no existe.

2. **Restricción técnica del enunciado:** El PDF obliga a que todas las consultas públicas
   filtren `activo = 1`. Esto crea un "fantasma" en la DB que el admin no ve pero que sí
   ocupa el UNIQUE.

3. **Semántica REST:** `POST` debería crear, no actualizar. Un upsert silencioso viola la
   pureza del verbo. Sin embargo, el contrato observable desde el exterior es que el recurso
   "aparece como nuevo", lo cual justifica pragmáticamente 201 Created.

4. **UX del administrador:** Responder "ya está registrado" a un recurso que el propio admin
   eliminó es confuso y obliga a recordar el estado interno de registros borrados.

5. **Robustez:** Confiar en el constraint de la DB para flujo de negocio acopla la capa de
   servicio a códigos de error de infraestructura (MySQL errno 1062), lo cual es frágil.

---

## Opciones evaluadas

### Opción A — Hard fail siempre (throw 409)

Pre-chequeo con `findBy*` (sin filtro de activo). Si el campo UNIQUE ya existe, lanzar 409
sin importar si está activo o inactivo.

**Pros:**

- Implementación simple, sin estados intermedios.
- Comportamiento predecible: POST siempre crea o falla.

**Contras:**

- El admin recibe "ya está registrado" por un recurso que, desde su perspectiva, no existe
  (fue eliminado). Semánticamente incorrecto.
- Obliga al cliente a conocer y manejar el estado interno del soft-delete.
- Para re-crear algo borrado, el admin necesita primero hacer un PUT de reactivación
  (recurso que podría no estar documentado o accesible fácilmente).

---

### Opción B — Confiar en el constraint de DB (capturar ER_DUP_ENTRY)

No hacer pre-chequeo. Dejar que MySQL lance `ER_DUP_ENTRY (1062)` y mapearlo a 409 con un
mensaje genérico como "El recurso ya existe. Si desea reactivarlo, use PUT /recurso/:id".

**Pros:**

- Cero queries extra en el camino feliz (no existe → INSERT directo).
- Menos código en la capa de servicio.

**Contras:**

- Imposible distinguir "existe y activo" de "existe e inactivo" sin una query adicional,
  lo que elimina la posibilidad de upsert automático.
- Acopla la lógica de negocio a códigos de error de infraestructura (errno 1062): si cambia
  el motor de DB, el comportamiento cambia silenciosamente.
- El cliente recibe el mismo error en dos situaciones muy distintas.

---

### Opción C — Comportamiento diferenciado por estado activo

Pre-chequeo con `findBy*` **sin filtro de activo** antes del INSERT:

```
POST /recurso { campos... }
├── findBy*(campo_unique) → no existe
│   └── INSERT → 201 Created
├── findBy*(campo_unique) → existe y activo = 1
│   └── throw → 409 Conflict  { message: "Ya existe activo. Usar PUT /recurso/:id para modificarlo." }
└── findBy*(campo_unique) → existe y activo = 0
    └── UPDATE (activo = 1 + sobrescribir todos los campos con el payload) → 201 Created
```

**Pros:**

- Honra el modelo mental del soft-delete: si está borrado, puede re-crearse.
- Evita errores de infraestructura (ER_DUP_ENTRY) en el camino de negocio.
- UX coherente: el admin no necesita saber si el recurso existió alguna vez.
- Los campos se sobrescriben con los nuevos valores del payload, evitando inconsistencias
  (ej.: un porcentaje_descuento desactualizado en una obra social reactivada).

**Contras:**

- Viola pureza REST: POST implícitamente actualiza en el caso de reactivación.
- Requiere una query de pre-chequeo extra en el camino feliz.
- Para usuarios (ver sección "Punto de tensión"), el upsert silencioso tiene matices de
  seguridad que dependen de decisiones internas del equipo (ver abajo).

---

## Opción elegida

**Opción C**

### Fundamento

Un registro con `activo = 0` es semánticamente inexistente para el dominio: fue eliminado.
Decirle al Administrador "ya está registrado" cuando él mismo lo eliminó es una contradicción
con el modelo mental que el propio soft-delete introduce.

La opción C resuelve el problema en la capa de negocio (servicio), donde debe resolverse, en
lugar de delegarlo al constraint de infraestructura (DB) o al cliente (forzando un flujo de
dos pasos: buscar → reactivar).

Se sobrescriben **todos los campos** del payload porque el admin está proveyendo el estado
actual y deseado del recurso; mantener datos viejos en un registro reactivado puede introducir
inconsistencias difíciles de detectar.

La respuesta es **201 Created** en el caso de reactivación porque, desde la perspectiva del
consumidor de la API, el recurso "aparece como nuevo" — no existía activo. Esta es una
convención pragmática, no REST puro.

---

## Punto de tensión: Usuarios

La entidad `usuarios` tiene dos campos UNIQUE (`documento` y `email`) y su gestión presenta
una ambigüedad que el equipo debe resolver:

**Decisión interna pendiente:** ¿En caso de **admitir la creacion de usuarios** (funcionalidad extra, punto 3), el endpoint `POST /usuarios` es público (registro libre) o
restringido al Administrador? El enunciado **no lo especifica** — es una decisión del equipo.

Esto afecta la superficie de riesgo del upsert:

- **Si el registro es público:** cualquier persona podría enviar un email/documento que
  perteneció a un usuario borrado y reactivarlo con nuevos datos. Esto es un riesgo real
  de seguridad/privacidad. En ese caso, se recomienda cambiar el comportamiento para usuarios
  a la **Opción A** (hard fail) y requerir que la reactivación sea un flujo explícito del Admin.

- **Si el registro es restringido al Admin:** el riesgo es menor dado el contexto de
  confianza. El upsert silencioso es aceptable y consistente con el comportamiento del resto
  de las entidades.

**El comportamiento documentado en este ADR asume acceso restringido al Admin.** Si el equipo
decide abrir el registro al público, este ADR debe revisarse para la entidad `usuarios`.

---

## Consecuencias

### Positivas

- Comportamiento consistente en todas las entidades con campos UNIQUE.
- El Administrador puede recrear recursos borrados sin conocer el estado interno del soft-delete.
- Los errores 409 solo ocurren cuando el recurso realmente existe y está activo, mensaje correcto.
- Sin dependencia de códigos de error de MySQL para flujo de negocio.

### Negativas

- Query extra de pre-chequeo en cada CREATE (costo aceptable dado el volumen).
- La semántica de POST no es estrictamente REST cuando hay reactivación implícita.
- El caso de usuarios tiene un riesgo latente si la decisión de acceso cambia (documentado arriba).

---

## Flujos por entidad

### Especialidades

- **UNIQUE:** `nombre`
- **Soft delete:** `especialidades.activo`
- **Pre-chequeo:** `findByNombre(nombre)` — sin filtro de activo
- **Flujo:**
  - `nombre` no existe → INSERT → 201
  - `nombre` existe y `activo = 1` → 409 `"La especialidad ya está registrada. Use PUT /especialidades/:id para modificarla."`
  - `nombre` existe y `activo = 0` → `UPDATE especialidades SET activo = 1, nombre = ? WHERE id_especialidad = ?` → 201

### Obras Sociales

- **UNIQUE:** `nombre`
- **Soft delete:** `obras_sociales.activo`
- **Pre-chequeo:** `findByNombre(nombre)` — sin filtro de activo
- **Flujo:**
  - `nombre` no existe → INSERT → 201
  - `nombre` existe y `activo = 1` → 409 `"La obra social ya está registrada. Use PUT /obras-sociales/:id para modificarla."`
  - `nombre` existe y `activo = 0` → `UPDATE obras_sociales SET activo = 1, nombre = ?, descripcion = ?, porcentaje_descuento = ?, es_particular = ? WHERE id_obra_social = ?` → 201

### Usuarios

- **UNIQUE:** `documento` (verificar primero), `email` (verificar segundo)
- **Soft delete:** `usuarios.activo`
- **Pre-chequeo:** `findByDocumento(documento)` y `findByEmail(email)` — ambos sin filtro de activo
- **Flujo:**
  - Ninguno de los dos campos existe → INSERT → 201
  - Cualquiera existe y `activo = 1` → 409 con mensaje apropiado al campo colisionado
  - Cualquiera existe y `activo = 0` → `UPDATE usuarios SET activo = 1, documento = ?, apellido = ?, nombres = ?, email = ?, contrasenia = ?, foto_path = ?, rol = ? WHERE id_usuario = ?` → 201
  - **Caso edge:** `documento` inactivo pero `email` diferente (o viceversa) → reactivar con todos los campos nuevos (el UPDATE sobrescribe ambos)
- **Ver sección "Punto de tensión"** para consideraciones de seguridad según quién accede al endpoint.

### Médicos

- **UNIQUE:** `matricula` (en tabla `medicos`)
- **Soft delete:** `usuarios.activo` (la tabla `medicos` no tiene columna `activo` propia; el borrado lógico se hace sobre el usuario asociado)
- **Pre-chequeo:** `findByMatricula(matricula)` — devuelve registro de medico con JOIN a usuarios; revisar `usuarios.activo` del FK
- **Flujo:**
  - `matricula` no existe → INSERT en `medicos` → 201
  - `matricula` existe y `usuarios.activo = 1` → 409 `"La matrícula ya está registrada. Use PUT /medicos/:id para modificarla."`
  - `matricula` existe y `usuarios.activo = 0` → `UPDATE usuarios SET activo = 1 WHERE id_usuario = ?` + `UPDATE medicos SET id_especialidad = ?, matricula = ?, descripcion = ?, valor_consulta = ? WHERE id_medico = ?` → 201
  - Nota: el `id_usuario` no cambia en la reactivación; se reactiva el usuario existente asociado a esa matrícula.

### Pacientes

- **UNIQUE de facto:** `id_usuario` es FK efectivamente único en `pacientes` (un usuario → un paciente)
- **Soft delete:** `usuarios.activo` (la tabla `pacientes` no tiene columna `activo` propia)
- **Pre-chequeo:** `findByIdUsuario(id_usuario)` — sin filtro de activo
- **Flujo:**
  - `id_usuario` no existe en pacientes → INSERT en `pacientes` → 201
  - `id_usuario` existe y `usuarios.activo = 1` → 409 `"El usuario ya tiene un paciente asociado."`
  - `id_usuario` existe y `usuarios.activo = 0` → `UPDATE usuarios SET activo = 1 WHERE id_usuario = ?` + `UPDATE pacientes SET id_obra_social = ? WHERE id_paciente = ?` → 201

### Turnos Reservas

- **UNIQUE:** ninguno
- No hay posibilidad de colisión UNIQUE en INSERT. El comportamiento es siempre INSERT → 201.
- El soft-delete aplica para cancelaciones (`activo = 0`) pero no afecta el CREATE.

---

## Decisión sobre findBy\* interno vs público

Los métodos `findBy*` tienen dos usos distintos que requieren comportamientos distintos:

| Uso                                               | Filtro de activo     | Ejemplos                                                                    |
| ------------------------------------------------- | -------------------- | --------------------------------------------------------------------------- |
| Validación interna (pre-chequeo en CREATE/UPDATE) | **Sin filtro**       | `findByNombre()`, `findByMatricula()`, `findByEmail()`, `findByDocumento()` |
| Respuestas públicas (GET endpoints)               | **Con `activo = 1`** | `findById()`, `findAll()`, `findByNombreActivo()`                           |

La entidad `especialidades` ya implementa esta distinción correctamente con `findByNombre()`
(sin filtro) y `findByNombreActivo()` (con filtro). El resto de las entidades debe ajustarse
al mismo patrón.

---

## Referencias

- Enunciado del TP Final Integrador — Programación III, 2026 1er cuatrimestre, p. 3
  ("todos los registros que se busquen de la base de datos deberán cumplir el criterio `activo = 1`")
- dump.sql — esquema provisto por la cátedra con definición de constraints UNIQUE
