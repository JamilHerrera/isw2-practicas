// Práctica 5: Código Sano - Separación de responsabilidades
// Objetivo: separar el CÁLCULO PURO del ENVÍO DE NOTIFICACIONES y del FORMATEO FINAL.
//
// Patrón aplicado: "Núcleo funcional, cáscara imperativa" (Functional Core, Imperative Shell).
//   - Núcleo funcional: calcularSubtotal, aplicarDescuentoCliente y calcularTotal.
//     Son funciones puras: ante las mismas entradas devuelven siempre la misma salida
//     y no producen efectos secundarios. Por eso son fáciles de testear y reutilizar.
//   - Capa imperativa: formatearResumen (presentación) y enviarNotificacion (comunicación).
//     Aquí viven los efectos secundarios, aislados en funciones pequeñas e inyectables.

const IMPUESTO_ISV = 0.15;
const DESCUENTO_VIP = 0.85;
const DESCUENTO_FRECUENTE = 0.93;
const UMBRAL_BONO = 500;
const BONO = 50;

/* ============================================================
 * 1. CÁLCULO PURO
 * Sin console.log, sin correos, sin formato: solo números que entran y salen.
 * ============================================================ */

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

/* ============================================================
 * 2. FORMATEO FINAL (presentación)
 * Recibe datos ya calculados y solo los convierte en texto legible.
 * No modifica ningún número ni dispara efectos secundarios.
 * ============================================================ */

/**
 * Construye el resumen de compra en texto plano a partir de datos ya procesados.
 */
function formatearResumen({ cliente, productos, tipoCliente, total }) {
  const lineas = [];

  lineas.push('=== RESUMEN DE COMPRA ===');
  lineas.push('Cliente: ' + cliente);

  for (const producto of productos) {
    const nombre = producto.nombre || 'Producto';
    const importe = (producto.precio * producto.cantidad).toFixed(2);
    lineas.push('- ' + nombre + ' x' + producto.cantidad + ': L. ' + importe);
  }

  lineas.push('Tipo de cliente: ' + tipoCliente);
  lineas.push('Total a pagar: L. ' + total.toFixed(2));

  return lineas.join('\n');
}

/* ============================================================
 * 3. ENVÍO DE NOTIFICACIONES (efectos secundarios)
 * Único lugar donde el código "toca" el mundo exterior.
 * El canal se inyecta como parámetro para poder probar sin enviar nada real.
 * ============================================================ */

/**
 * Envía un mensaje al destinatario usando el canal proporcionado.
 * Por defecto usa console.log; en producción podría ser un correo o SMS.
 */
function enviarNotificacion(destinatario, mensaje, canal = console.log) {
  if (!destinatario) {
    throw new Error('El destinatario es obligatorio.');
  }

  if (!mensaje) {
    throw new Error('El mensaje es obligatorio.');
  }

  canal('[NOTIFICACION] Para ' + destinatario + ': ' + mensaje);
}

/* ============================================================
 * 4. ORQUESTACIÓN
 * Único punto donde se combinan cálculo, formato y notificación.
 * Cada responsabilidad sigue siendo independiente y testeable por separado.
 * ============================================================ */

/**
 * Procesa un pedido completo: calcula el total, formatea el resumen
 * y envía la notificación al cliente.
 */
function procesarPedido(pedido, canal = console.log) {
  const total = calcularTotal(pedido.productos, pedido.tipoCliente);

  const resumen = formatearResumen({
    cliente: pedido.cliente,
    productos: pedido.productos,
    tipoCliente: pedido.tipoCliente,
    total,
  });

  enviarNotificacion(pedido.cliente, resumen, canal);

  return { total, resumen };
}

// Demostración rápida: node practica-5/sano.js
if (require.main === module) {
  procesarPedido({
    cliente: 'Ana',
    productos: [
      { nombre: 'Teclado', precio: 300, cantidad: 2 },
      { nombre: 'Mouse', precio: 150, cantidad: 1 },
    ],
    tipoCliente: 'vip',
  });
}

module.exports = {
  // Cálculo puro
  calcularSubtotal,
  aplicarDescuentoCliente,
  calcularTotal,
  // Formateo final
  formatearResumen,
  // Envío de notificaciones
  enviarNotificacion,
  // Orquestación
  procesarPedido,
  // Constantes
  IMPUESTO_ISV,
  DESCUENTO_VIP,
  DESCUENTO_FRECUENTE,
  UMBRAL_BONO,
  BONO,
};