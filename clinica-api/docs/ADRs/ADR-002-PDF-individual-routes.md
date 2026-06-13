# ADR-002: Rutas dedicadas `/pdf` en lugar de content negotiation para generación de PDFs

- **Fecha:** 2026-06-13
- **Estado:** Aceptado
- **Autores:** Equipo grupo-u-idw

---

## Contexto

Las estadísticas del administrador (por obra social, por médico, por especialidad y el
resumen general) deben poder descargarse como PDF además de consultarse como JSON.

Al momento de diseñar estos endpoints surgió la pregunta: ¿cómo debe el cliente indicar que
quiere un PDF en lugar de JSON?

Existen dos enfoques estándar:

1. **Content negotiation** — el cliente envía `Accept: application/pdf` en el header de la
   misma ruta (`GET /estadisticas/por-obra-social`) y el servidor responde con el tipo de
   contenido apropiado.

2. **Rutas dedicadas** — se agrega un segmento `/pdf` al final de la ruta existente
   (`GET /estadisticas/por-obra-social/pdf`), resultando en un endpoint separado para cada
   recurso que tenga representación PDF.

---

## Fuerzas en juego

1. **Herramientas de prueba del equipo:** El equipo usa navegadores y Swagger UI para probar
   la API durante el desarrollo. Ambas herramientas permiten navegar a una URL directamente,
   pero no permiten modificar headers `Accept` con facilidad — en particular Swagger genera
   automáticamente la petición con el content type del esquema definido.

2. **Exploración directa desde el navegador:** Un PDF accedido mediante una URL dedicada puede
   abrirse directamente pegando la URL en el navegador, lo que facilita la verificación visual
   del contenido generado sin herramientas adicionales.

3. **Documentación en Swagger (OpenAPI):** Content negotiation en una sola ruta requiere
   definir múltiples `content` types bajo la misma operación. Swagger UI solo renderiza uno
   a la vez y no provee un botón para cambiar el `Accept` header en el formulario de prueba,
   lo que hace la documentación interactiva menos útil para el PDF.

4. **Complejidad de implementación:** Content negotiation requiere un `if/switch` sobre el
   header `Accept` dentro del mismo handler o un middleware de detección de formato, además
   de gestión de casos donde el `Accept` sea ambiguo o ausente. Rutas dedicadas delegan la
   elección del formato al enrutador de Express, sin lógica extra en el handler.

5. **Cantidad de rutas afectadas:** Solo cuatro endpoints tienen representación PDF (las
   cuatro estadísticas del admin), por lo que la proliferación de rutas es acotada y manejable.

6. **Separación de concerns:** Cada ruta `/pdf` tiene su propio handler en el controlador
   (`porObraSocialPdf`, `porMedicoPdf`, etc.), lo que mantiene los handlers JSON sin
   contaminación de lógica de generación de PDF.

---

## Opciones evaluadas

### Opción A — Content negotiation (`Accept: application/pdf`)

El cliente envía `Accept: application/pdf` a la ruta existente. El handler detecta el header
y ramifica la respuesta.

```
GET /estadisticas/por-obra-social
  Accept: application/json  → { success: true, data: [...] }
  Accept: application/pdf   → <stream binario PDF>
```

**Pros:**

- Semánticamente puro: el mismo recurso representado en distintos formatos sigue siendo REST
  estricto.
- No hay proliferación de rutas.

**Contras:**

- No se puede probar directamente desde el navegador ni desde Swagger UI sin modificar headers.
- El handler JSON y el handler PDF comparten la misma ruta, acoplando lógicas diferentes en
  un mismo punto de entrada o forzando un middleware extra de detección de formato.
- Swagger requiere definición de múltiples `content` types en la misma operación, y la UI
  no expone un control para cambiar el `Accept` header en el formulario de prueba.
- El comportamiento ante un `Accept: */*` o `Accept` ausente requiere una convención adicional
  (¿responder JSON por defecto? ¿error 406?).

---

### Opción B — Rutas dedicadas (`/pdf` como segmento final) ✓ Elegida

Se agrega un sub-recurso `/pdf` a cada endpoint que deba generar un PDF.

```
GET /estadisticas/por-obra-social        → JSON
GET /estadisticas/por-obra-social/pdf    → PDF
```

**Pros:**

- La URL es autoexplicativa: el formato de la respuesta es evidente sin inspeccionar headers.
- Funciona directamente desde el navegador y desde Swagger UI sin configuración extra.
- Cada endpoint tiene su propio handler y su propia entrada en la documentación OpenAPI,
  con `content: application/pdf` claramente definido y ejecutable desde Swagger.
- Sin lógica de detección de formato en los handlers: Express enruta al handler correcto.
- Los handlers JSON existentes no necesitan modificarse para soportar PDF.

**Contras:**

- Estrictamente no es REST puro: el formato de representación se codifica en la URL.
- Agrega N rutas extra (una por cada recurso con soporte PDF).

---

## Opción elegida

**Opción B — Rutas dedicadas `/pdf`**

### Fundamento

El criterio dominante fue la **practicidad del flujo de desarrollo y prueba**. En el contexto
de un TP académico con un equipo pequeño que usa Swagger UI y navegadores como herramientas
principales, content negotiation agrega fricción sin aportar valor observable.

Una URL como `GET /estadisticas/por-obra-social/pdf` es inequívoca, testeable con un click
desde Swagger, y abre el PDF directamente en el navegador — lo que facilita la verificación
visual durante el desarrollo.

La desviación del REST puro es aceptable: la convención de `/pdf` como segmento final es
ampliamente reconocida y no genera ambigüedad para ningún consumidor de la API.

---

## Rutas resultantes con soporte PDF

| Recurso JSON                               | Ruta PDF                                    | Rol requerido |
| ------------------------------------------ | ------------------------------------------- | ------------- |
| `GET /estadisticas/por-obra-social`        | `GET /estadisticas/por-obra-social/pdf`     | Admin (3)     |
| `GET /estadisticas/por-medico`             | `GET /estadisticas/por-medico/pdf`          | Admin (3)     |
| `GET /estadisticas/por-especialidad`       | `GET /estadisticas/por-especialidad/pdf`    | Admin (3)     |
| `GET /estadisticas/resumen-general`        | `GET /estadisticas/resumen-general/pdf`     | Admin (3)     |

Todos los endpoints PDF aplican los mismos middlewares de autenticación (`authenticate`),
autorización (`authorize`) y validación de parámetros que su equivalente JSON.

---

## Consecuencias

### Positivas

- Los PDFs son accesibles directamente desde el navegador sin herramientas adicionales.
- La documentación Swagger refleja endpoints independientes con `content: application/pdf`,
  ejecutables desde la UI.
- Los handlers JSON no requieren modificaciones; la separación de handlers es limpia.
- Los parámetros de query (`fecha_desde`, `fecha_hasta`) y la lógica de negocio son
  compartidos entre el handler JSON y el PDF a través del mismo servicio subyacente.

### Negativas

- Cada recurso con soporte PDF duplica la definición de ruta (JSON + PDF).
- Estrictamente no es REST puro: el formato está codificado en la URL en lugar de en el
  header `Accept`.

---

## Referencias

- Enunciado del TP Final Integrador — Programación III, 2026 1er cuatrimestre
- [src/routes/v1/estadisticas.js](../../src/routes/v1/estadisticas.js) — implementación de las rutas PDF
