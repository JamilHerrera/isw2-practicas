# Práctica 9 · Bitácora de desarrollo asistido por IA

**Feature:** abonos parciales que reducen el saldo de una deuda antes de
calcular la mora sobre la calculadora de fiados de la [Práctica 4](../practica-4/).

**Asistente usado:** Claude (Claude Code), dentro de esta misma sesión de
trabajo del repositorio.

> **Nota sobre la numeración de principios.** El enunciado pide citar
> principios "por número", pero no tengo acceso a la lista numerada oficial
> del curso (solo se menciona "M4" como módulo). Uso acá la nomenclatura que
> ya quedó establecida en este mismo repositorio — SOLID por letra en
> [practica-3/notas.md](../practica-3/notas.md) (Principio S, Principio D) y
> los cinco principios enumerados en
> [practica-5/diagnostico.md](../practica-5/diagnostico.md) (1. Legibilidad,
> 2. Mantenibilidad, 3. Simplicidad/KISS, 4. SRP, 5. Open/Closed) — para no
> inventar una numeración que no me consta. Si tu material de clase usa otra,
> reemplazá los números de esta bitácora por los correctos antes de entregar.

---

## 1. El contrato: tests escritos antes de la implementación

Antes de pedirle nada a la IA, se cerraron tres decisiones de diseño que el
enunciado original ("abonos parciales que reducen el saldo antes de calcular
mora") dejaba abiertas. Sin esas decisiones, los tests no podían escribirse
— son exactamente el tipo de ambigüedad que un contrato de tests obliga a
resolver antes de escribir una sola línea de implementación:

| Decisión | Elegido | Alternativa descartada |
|---|---|---|
| Abono mayor al monto original | Lanza error | Saturar en 0 / permitir saldo negativo a favor |
| Abono en 0 | Válido, equivale a `calcularMora` sin abono | Debe lanzar error |
| Firma de la función | `calcularMoraConAbono(monto, abono, diasVencidos)`, una sola función | Dos funciones separadas (`calcularSaldoConAbono` + reutilizar `calcularMora`) |

Con el contrato cerrado, se escribieron 5 tests en
[`practica-4/fiados-abono.test.js`](../practica-4/fiados-abono.test.js) —
**antes de que `calcularMoraConAbono` existiera**. La historia de commits lo
prueba directamente:

```
8b0d97d test(practica-9): write failing tests for calcularMoraConAbono (RED)
9901538 feat(practica-9): implement calcularMoraConAbono (GREEN)
```

El primer commit trae únicamente el archivo de tests. Corrido en ese estado:

```
❌ FAIL: El abono reduce el saldo antes de calcular la mora
   calcularMoraConAbono is not a function
❌ FAIL: Un abono de 0 se comporta igual que calcularMora sin abono
   calcularMoraConAbono is not a function
✅ PASS: Lanza error si el abono es mayor al monto original
✅ PASS: Lanza error si el abono es negativo
❌ FAIL: Sin días vencidos, el saldo reducido no genera mora
   calcularMoraConAbono is not a function

--- Resultado: 2 pasaron, 3 fallaron ---
```

Rojo real, no simulado: 3 de 5 fallan porque la función todavía no existe.

---

## 2. Prompts clave y qué propuso la IA

### Prompt 1 — cerrar el contrato

> *"Si el abono es MAYOR que el monto original de la deuda, ¿qué debe hacer
> la función: lanzar error, saturar el saldo en 0, o permitir saldo
> negativo? ¿El abono puede ser 0? ¿Cómo se llama la función y qué firma
> tiene?"*

La IA no decidió esto — lo presentó como tres preguntas de opción múltiple
con una recomendación justificada en cada una, y esperó la respuesta antes
de escribir código. Esto es lo que después se convirtió en los 5 tests: sin
esas tres decisiones, los tests de "abono excesivo" y "abono en 0" no
podrían haberse escrito con valores concretos.

### Prompt 2 — implementar, con una alternativa forzada

> *"Escribí `calcularMoraConAbono` para que pase estos 5 tests (sin
> tocarlos). Antes de aplicar la implementación al repo, armá dos versiones
> distintas, corré ambas contra los mismos tests sin modificarlos, y elegí
> una con justificación."*

La IA propuso dos implementaciones reales (no una sola "obvia"), ambas
verificadas contra el mismo archivo de tests sin tocarlo:

**Alternativa A — delega en `calcularMora`:**
```js
function calcularMoraConAbono(monto, abono, diasVencidos) {
  if (typeof abono !== 'number' || Number.isNaN(abono)) {
    throw new Error('El abono debe ser un número válido.');
  }
  if (abono < 0) throw new Error('El abono no puede ser negativo.');
  if (abono > monto) throw new Error('El abono no puede ser mayor al monto original.');

  const saldo = monto - abono;
  return calcularMora(saldo, diasVencidos); // reutiliza la regla del 5%
}
```

**Alternativa B — autocontenida, con `TASA_MORA` extraída:**
```js
const TASA_MORA = 0.05;

function calcularMoraConAbono(monto, abono, diasVencidos) {
  if (typeof abono !== 'number' || Number.isNaN(abono)) {
    throw new Error('El abono debe ser un número válido.');
  }
  if (typeof diasVencidos !== 'number' || Number.isNaN(diasVencidos)) {
    throw new Error('Los días vencidos deben ser un número válido.');
  }
  if (abono < 0) throw new Error('El abono no puede ser negativo.');
  if (abono > monto) throw new Error('El abono no puede ser mayor al monto original.');

  const saldo = monto - abono;
  return diasVencidos > 0 ? saldo * TASA_MORA : 0; // no llama a calcularMora
}
```

Las dos pasaron los 5 tests, **idénticas** en el resultado:

```
Alternativa A: 5 pasaron, 0 fallaron
Alternativa B: 5 pasaron, 0 fallaron
```

### Prompt 3 — forzar la comparación más allá de los tests escritos

> *"Los 5 tests no las distinguen. Probá ambas con un caso que no esté en
> el contrato escrito — por ejemplo `monto` inválido — y decime si hay
> alguna diferencia real."*

Acá apareció la diferencia real (sección 3, observación 1).

---

## 3. Crítica del diff — 4 observaciones fundamentadas

### Observación 1 — Aceptado con corrección: ambas alternativas heredaban un bug de validación incompleta

*(Principio 1 — Legibilidad / contrato completo de la función, y por
extensión el mismo espíritu del Principio D de
[practica-3](../practica-3/notas.md): una función debe poder confiar en la
validez de lo que recibe o validarlo ella misma, no asumirlo a medias.)*

Al probar ambas alternativas con `calcularMoraConAbono(NaN, 0, 5)` y
`calcularMoraConAbono('cien', 0, 5)` — casos que **no** estaban en mis 5
tests porque el contrato original nunca mencionó qué hacer con un `monto`
inválido — las dos devolvieron `NaN` en silencio en vez de lanzar un error:

```
Alt A -> NaN
Alt B -> NaN
```

Esto es la misma falla que había encontrado al auditar `calcularMora`
original *antes* de diseñar esta feature: esa función valida el tipo de
`diasVencidos` pero nunca el de `monto`. Las dos implementaciones que
propuso la IA copiaron el patrón de validación existente (revisar `abono`
y `diasVencidos`, no `monto`) y heredaron el mismo agujero.

**Lo que corregí:** agregué una validación explícita de `monto` en
`calcularMoraConAbono` — no en `calcularMora`, para no tocar comportamiento
de la P4 que ya tiene su propia suite y su propio historial de commits.
Verificado después del fix:

```
monto=NaN lanza: El monto debe ser un número válido.
monto="cien" lanza: El monto debe ser un número válido.
```

Los 5 tests del contrato siguieron en verde sin cambios — la corrección no
tocó ninguna de las 5 aserciones ya escritas.

### Observación 2 — Aceptado: Alternativa A por reutilización, no por longitud de código

*(Principio 5 — Open/Closed, de
[practica-5/diagnostico.md](../practica-5/diagnostico.md).)*

Elegí la Alternativa A (delega en `calcularMora`) sobre la B (autocontenida)
por un motivo concreto, no estético: si la regla de mora cambia algún día
—por ejemplo, una tasa escalonada según los días vencidos en vez de un 5%
plano—, la Alternativa A la hereda automáticamente sin tocar
`calcularMoraConAbono`, porque delega el cálculo entero en `calcularMora`.
La Alternativa B tendría que modificarse en dos lugares para el mismo
cambio, con el riesgo de que alguien actualice uno y se olvide del otro.

Esto es exactamente el motivo por el que rechacé la opción "dos funciones
separadas" en el diseño del contrato (sección 1): no era que estuviera mal,
sino que ya había una función (`calcularMora`) que cumplía ese rol, y crear
una segunda ruta de cálculo paralela —aunque fuera una sola llamada
encadenada— multiplicaba el lugar donde vive la regla del 5%.

### Observación 3 — Aceptado: número mágico extraído, pero solo donde correspondía

*(Principio 2 — Mantenibilidad, de
[practica-5/diagnostico.md](../practica-5/diagnostico.md).)*

`fiados.js` original tenía `monto * 0.05` como literal, sin nombre. La
Alternativa B extraía `TASA_MORA` como constante compartida; la Alternativa
A, en su primer borrador, no. Acepté la extracción de la constante —es la
misma corrección que ya se había aplicado en la Práctica 5
(`DESCUENTO_VIP`, `IMPUESTO_ISV`, etc.)— pero la apliqué **sobre la
Alternativa A elegida**, no adoptando la B completa: se puede quedarse con
el beneficio de un cambio (la constante con nombre) sin heredar la
duplicación de lógica que traía el resto de esa alternativa.

### Observación 4 — Rechazado en parte: dos de mis propios tests "pasaban" por la razón equivocada

*(Principio 3 — Simplicidad/KISS, de
[practica-5/diagnostico.md](../practica-5/diagnostico.md) — aplicado acá a
la simplicidad del test en sí: un test debe fallar solo por la causa que
dice probar.)*

Esta no es una crítica al código de la IA, sino a mis propios tests, y la
dejo igual porque la detecté revisando el propio diff del estado rojo. Al
correr la suite ANTES de que `calcularMoraConAbono` existiera, los tests
*"Lanza error si el abono es mayor al monto original"* y *"Lanza error si
el abono es negativo"* aparecían en verde:

```
✅ PASS: Lanza error si el abono es mayor al monto original
✅ PASS: Lanza error si el abono es negativo
```

No porque probaran lo que dicen probar, sino porque **cualquier** excepción
—incluido el `TypeError: calcularMoraConAbono is not a function`— cae en el
mismo `catch` genérico y, como su mensaje no coincide con el texto exacto
que dispararía el re-throw, el test se da por bueno. Son falsos positivos
válidos solo por accidente. No reescribí el test (el patrón
`try/catch` + mensaje centinela es el mismo que ya usan
[`fiados.test.js`](../practica-4/fiados.test.js) y
[`enfermo.test.js`](../practica-5/enfermo.test.js) de prácticas anteriores,
y cambiarlo ahora habría sido tocar una convención establecida fuera del
alcance de esta feature), pero lo dejo documentado acá porque es la clase
de cosa que hace que un pipeline en rojo parezca "medio verde" cuando en
realidad no probó nada.

---

## 4. Resultado final

| Suite | Estado |
|---|---|
| [`practica-4/fiados.test.js`](../practica-4/fiados.test.js) (P4 original) | ✅ 6/6 — sin cambios |
| [`practica-4/fiados-abono.test.js`](../practica-4/fiados-abono.test.js) (P9, contrato) | ✅ 5/5 — sin cambios desde el commit RED |
| `npm test` (las 3 suites, vía `scripts/test-all.js`) | ✅ 3/3 suites |

```
RESUMEN
================================================================
✅ OK    Práctica 4 · Calculadora de fiados
✅ OK    Práctica 5 · Cálculo de totales
✅ OK    Práctica 9 · Abonos parciales (sobre fiados.js de P4)

3 de 3 suites pasaron.
```
