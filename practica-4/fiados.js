// TASA_MORA extraída como constante compartida (era un número mágico 0.05
// inline en calcularMora; calcularMoraConAbono necesita la misma tasa y
// duplicarla como literal habría sido la próxima fuente de inconsistencia
// si algún día cambia).
const TASA_MORA = 0.05;

function calcularMora(monto, diasVencidos) {

  if (typeof diasVencidos !== 'number' || Number.isNaN(diasVencidos)) {
    throw new Error('Los días vencidos deben ser un número válido.');
  }

  if (monto < 0) {
    throw new Error('El monto no puede ser negativo.');
  }


  if (diasVencidos > 0) {
    return monto * TASA_MORA;
  }

  return 0;
}

/**
 * Práctica 9: reduce el saldo por un abono parcial antes de calcular la
 * mora. Delega el cálculo de la mora en calcularMora (una sola fuente de
 * verdad para la regla del 5%): si esa regla cambia, esta función la
 * hereda automáticamente sin tocarla.
 *
 * Valida `monto` explícitamente porque calcularMora NO lo hacía: un monto
 * no numérico (NaN, string) pasaba silenciosamente y devolvía NaN en vez
 * de lanzar. Hallazgo de auditoría corregido acá, no en calcularMora, para
 * no alterar el comportamiento ya cubierto por los tests de la Práctica 4.
 */
function calcularMoraConAbono(monto, abono, diasVencidos) {
  if (typeof monto !== 'number' || Number.isNaN(monto)) {
    throw new Error('El monto debe ser un número válido.');
  }

  if (typeof abono !== 'number' || Number.isNaN(abono)) {
    throw new Error('El abono debe ser un número válido.');
  }

  if (abono < 0) {
    throw new Error('El abono no puede ser negativo.');
  }

  if (abono > monto) {
    throw new Error('El abono no puede ser mayor al monto original.');
  }

  const saldo = monto - abono;
  return calcularMora(saldo, diasVencidos);
}

module.exports = { calcularMora, calcularMoraConAbono };
