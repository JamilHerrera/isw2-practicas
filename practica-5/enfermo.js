// Práctica 5: Refactorización de código enfermo
// Paso: Extraer Constantes — los números mágicos ahora tienen nombre.

const IMPUESTO_ISV = 0.15;
const DESCUENTO_VIP = 0.85;
const DESCUENTO_FRECUENTE = 0.93;
const UMBRAL_BONO = 500;
const BONO = 50;

/**
 * Calcula el total a pagar de una venta aplicando:
 *  1. Descuento según el tipo de cliente (vip o frecuente).
 *  2. Bono de L. 50 si el subtotal alcanza o supera L. 500.
 *  3. Impuesto ISV (15%) sobre el monto final.
 */
function calcularTotal(monto, tipoCliente) {
  // Retornos tempranos para entradas inválidas
  if (typeof monto !== 'number' || Number.isNaN(monto)) {
    throw new Error('El monto debe ser un número válido.');
  }

  if (monto < 0) {
    throw new Error('El monto no puede ser negativo.');
  }

  if (!['vip', 'frecuente', 'normal'].includes(tipoCliente)) {
    throw new Error('El tipo de cliente debe ser "vip", "frecuente" o "normal".');
  }

  let subtotal = monto;

  // Descuento según el tipo de cliente
  if (tipoCliente === 'vip') {
    subtotal *= DESCUENTO_VIP;
  } else if (tipoCliente === 'frecuente') {
    subtotal *= DESCUENTO_FRECUENTE;
  }

  // Bono al alcanzar el umbral de compra
  if (subtotal >= UMBRAL_BONO) {
    subtotal -= BONO;
  }

  // Impuesto sobre ventas
  const isv = subtotal * IMPUESTO_ISV;

  return Number((subtotal + isv).toFixed(2));
}

module.exports = {
  calcularTotal,
  IMPUESTO_ISV,
  DESCUENTO_VIP,
  DESCUENTO_FRECUENTE,
  UMBRAL_BONO,
  BONO,
};