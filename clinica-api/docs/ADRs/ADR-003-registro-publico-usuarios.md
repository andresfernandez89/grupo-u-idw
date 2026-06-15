# ADR-003: Registro público de usuarios con rol paciente por defecto

- **Fecha:** 2026-06-13
- **Estado:** Aceptado
- **Autores:** Equipo grupo-u-idw
- **Invalida:** Sección "Punto de tensión: Usuarios" de ADR-001

---

## Contexto

ADR-001 documentó el comportamiento de CREATE frente a colisiones UNIQUE en contexto de
soft-delete y eligió la Opción C (reactivación silenciosa) para todas las entidades. Sin
embargo, dejó explícitamente pendiente la decisión sobre la entidad `usuarios`:

> **Decisión interna pendiente:** ¿El endpoint `POST /usuarios` es público (registro libre)
> o restringido al Administrador?

ADR-001 advertía que, si el registro fuera público, el upsert silencioso representaba un
riesgo de seguridad: cualquier persona podría enviar un email/documento de un usuario
eliminado y reactivarlo con datos propios, potencialmente recuperando un rol elevado
(médico, admin).

---

## Decisión

`POST /usuarios` es **público** (sin autenticación). El campo `rol` es ignorado en el body
y siempre se asigna `rol = 2 (paciente)`.

Esta decisión aplica tanto a registros nuevos como a colisiones con registros soft-deleted:
en ambos casos el usuario resultante tiene `rol = 2`, sin importar el rol que tuviera el
registro eliminado.

El campo `rol` **solo puede modificarse** mediante `PUT /usuarios/:id`, endpoint que requiere
autenticación y rol de administrador (`rol = 3`).

---

## Fuerzas en juego

1. **Registro de pacientes:** el caso de uso principal de registro público es que un nuevo
   paciente cree su cuenta para luego reservar turnos. Nunca tiene sentido que alguien se
   auto-asigne el rol de médico o administrador.

2. **Riesgo de seguridad por upsert:** ADR-001 identificó que el upsert sobre un registro
   eliminado permitiría recuperar un rol elevado si el campo `rol` se respetara. Forzar
   siempre `rol = 2` elimina este vector de ataque.

3. **Consistencia con ADR-001:** se mantiene la Opción C (reactivación) para el soft-delete
   en la entidad `usuarios`, pero con la restricción de `rol` forzado. No se adopta la
   Opción A (hard fail) porque el riesgo identificado queda mitigado.

4. **Escalada de privilegios:** el flujo de asignación de roles queda centralizado en el
   administrador, que puede elevar un paciente a médico o admin vía PUT.

---

## Flujo resultante para `POST /usuarios` (público)

```
POST /usuarios { documento, apellido, nombres, email, contrasenia, [foto_path] }
├── email activo = 1  → 409 "El email ya está registrado"
├── documento activo = 1  → 409 "El documento ya está registrado"
├── documento/email activo = 0  → UPDATE SET activo = 1, rol = 2, ...todos los campos → 201 Created
└── ninguno existe  → INSERT rol = 2 → 201 Created
```

Notas:

- El campo `rol` en el body es ignorado en todos los casos.
- En la reactivación, el `documento` tiene prioridad sobre el `email` para determinar qué
  registro inactivo se reactiva (consistente con el orden de pre-chequeo de ADR-001).
- Si `documento` y `email` pertenecen a registros inactivos **distintos**, se intenta
  reactivar el de `documento` y MySQL puede lanzar `ER_DUP_ENTRY` por el email del otro
  registro. En ese caso la API responde 409. Este caso extremo es infrecuente en la práctica.

---

## Flujo para `PUT /usuarios/:id` (solo administrador)

```
PUT /usuarios/:id  [requiere authenticate + authorize(3)]
{ documento, apellido, nombres, email, contrasenia, rol, [foto_path] }
└── admin puede modificar cualquier campo, incluido rol → 200 OK
```

---

## Consecuencias

### Positivas

- Cualquier persona puede registrarse como paciente sin necesidad de que un admin intervenga.
- No existe forma de que un registro público resulte con rol distinto de paciente, incluso
  via reactivación de registros eliminados.
- La gestión de roles queda exclusivamente en manos del administrador.

### Negativas

- El endpoint `POST /usuarios` acepta un campo `rol` en el body (no genera error de
  validación si se envía), simplemente lo ignora. Esto puede resultar confuso para
  consumidores de la API que no lean la documentación; el OpenAPI doc debe reflejarlo.
- La Opción A (hard fail) hubiera sido más segura en términos estrictos, pero se descartó
  porque el forcing de `rol = 2` mitiga el riesgo de forma suficiente para el dominio de
  este sistema.

---

## Referencias

- ADR-001: Comportamiento de CREATE frente a colisiones UNIQUE en contexto de soft-delete
- ADR-002: Rutas dedicadas para generación de PDFs
- Enunciado del TP Final Integrador — Programación III, 2026 1er cuatrimestre
