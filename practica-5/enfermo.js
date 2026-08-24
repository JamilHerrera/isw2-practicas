// Práctica 5: Refactorización de código enfermo
// Paso anterior: Extraer Constantes.
// Paso actual: Extraer Funciones - calcularSubtotal y aplicarDescuentoCliente.

const IMPUESTO_ISV = 0.15;
const DESCUENTO_VIP = 0.85;
const DESCUENTO_FRECUENTE = 0.93;
const UMBRAL_BONO = 500;
const BONO = 50;

/**
 * Suma precio * cantidad de cada producto del carrito.
 */
function calcularSubtotal(productos) {
  if (!Array.isArray(productos)) {
    throw new Error('Los productos deben ser un arreglo.');
  }

  let subtotal = 0;

  for (const producto of productos) {
    if (typeof producto.precio !== 'number' || Number.isNaN(producto.precio) || producto.precio < 0) {
      throw new Error('Cada producto debe tener un precio numérico no negativo.');
    }

    if (typeof producto.cantidad !== 'number' || Number.isNaN(producto.cantidad) || producto.cantidad <= 0) {
      throw new Error('Cada producto debe tener una cantidad numérica mayor a cero.');
    }

    subtotal += producto.precio * producto.cantidad;
  }

  return subtotal;
}

/**
 * Aplica el descuento correspondiente según el tipo de cliente.
 */
function aplicarDescuentoCliente(subtotal, tipoCliente) {
  if (typeof subtotal !== 'number' || Number.isNaN(subtotal)) {
    throw new Error('El subtotal debe ser un número válido.');
  }

  if (subtotal < 0) {
    throw new Error('El subtotal no puede ser negativo.');
  }

  if (!['vip', 'frecuente', 'normal'].includes(tipoCliente)) {
    throw new Error('Tipo de cliente inválido. Use vip, frecuente o normal.');
  }

  if (tipoCliente === 'vip') {
    return subtotal * DESCUENTO_VIP;
  }

  if (tipoCliente === 'frecuente') {
    return subtotal * DESCUENTO_FRECUENTE;
  }

  return subtotal;
}

/**
 * Calcula el total a pagar aplicando en orden:
 *  1. Subtotal del carrito (calcularSubtotal).
 *  2. Descuento por tipo de cliente (aplicarDescuentoCliente).
 *  3. Bono de L. 50 si el monto alcanza o supera L. 500.
 *  4. Impuesto ISV (15%).
 */
function calcularTotal(productos, tipoCliente) {
  const subtotal = calcularSubtotal(productos);
  const conDescuento = aplicarDescuentoCliente(subtotal, tipoCliente);

  let monto = conDescuento;

  // Bono al alcanzar el umbral de compra
  if (monto >= UMBRAL_BONO) {
    monto -= BONO;
  }

  // Impuesto sobre ventas
  const isv = monto * IMPUESTO_ISV;

  return Number((monto + isv).toFixed(2));
}

module.exports = {
  calcularTotal,
  calcularSubtotal,
  aplicarDescuentoCliente,
  IMPUESTO_ISV,
  DESCUENTO_VIP,
  DESCUENTO_FRECUENTE,
  UMBRAL_BONO,
  BONO,
};