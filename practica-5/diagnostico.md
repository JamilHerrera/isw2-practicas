# Práctica 5 · Diagnóstico del código enfermo

Tabla de olores detectados en el código original, el principio que cada uno
violaba y el refactor con que se corrigió.

| Problema / Code Smell | Principio Violado | Refactor Aplicado |
|---|---|---|
| Nombres de variables crípticos (`p`, `u`, `calc`) | Principio de Legibilidad | Se renombraron variables y parámetros a nombres descriptivos en español (`productos`, `unidades`, `calcularTotalVenta`). |
| Números mágicos quemados (`0.85`, `0.15`, `500`, `50`) | Principio de Mantenibilidad | Se extrajeron constantes declarativas (`DESCUENTO_VIP`, `IMPUESTO_ISV`, `UMBRAL_BONO_DESCUENTO`). |
| Múltiples niveles de anidamiento `if/else` | Principio de Simplicidad (KISS) | Se reemplazaron las estructuras anidadas por *early returns* (guard clauses). |
| La función calcula, formatea texto y envía emails | Principio 3 (SRP · Responsabilidad Única) | Se separó la función de cálculo puro de las tareas de formateo y notificación. |
| Cadena de `if/else` rígida según el tipo de cliente | Principio Open/Closed (OCP) | Se parametrizaron las tasas de descuento mediante una estructura de mapa por tipo de cliente. |

## Archivos de esta práctica

| Archivo | Rol |
|---|---|
| [`enfermo.js`](enfermo.js) | Código tras extraer constantes y funciones |
| [`sano.js`](sano.js) | Versión final con núcleo puro separado de los efectos |
| [`enfermo.test.js`](enfermo.test.js) | Suite de 21 tests, ejecutada por el pipeline de CI |
