// Práctica 5: Tests de Cálculo de Totales
// Valida calcularSubtotal, aplicarDescuentoCliente y calcularTotal.

const { calcularTotal, calcularSubtotal, aplicarDescuentoCliente, IMPUESTO_ISV, DESCUENTO_VIP, DESCUENTO_FRECUENTE, UMBRAL_BONO, BONO } = require('./enfermo');

const OK = String.fromCharCode(9989);
const BAD = String.fromCharCode(10060);

function assertEqual(actual, esperado) {
  if (actual !== esperado) {
    throw new Error('Esperado: ' + esperado + ', pero se obtuvo: ' + actual);
  }
}

function test(nombre, fn) {
  try {
    fn();
    console.log(OK + ' PASS: ' + nombre);
  } catch (e) {
    console.error(BAD + ' FAIL: ' + nombre);
    console.error('   ' + e.message);
  }
}

console.log('--- Corriendo Tests de Cálculo de Totales (Práctica 5) ---');
console.log('');

// Constantes extraídas

test('IMPUESTO_ISV es 0.15', () => {
  assertEqual(IMPUESTO_ISV, 0.15);
});

test('DESCUENTO_VIP es 0.85', () => {
  assertEqual(DESCUENTO_VIP, 0.85);
});

test('DESCUENTO_FRECUENTE es 0.93', () => {
  assertEqual(DESCUENTO_FRECUENTE, 0.93);
});

test('UMBRAL_BONO es 500', () => {
  assertEqual(UMBRAL_BONO, 500);
});

test('BONO es 50', () => {
  assertEqual(BONO, 50);
});

// calcularSubtotal

test('calcularSubtotal suma precio por cantidad de cada producto', () => {
  assertEqual(calcularSubtotal([{ precio: 100, cantidad: 2 }, { precio: 50, cantidad: 1 }]), 250);
});

test('calcularSubtotal retorna 0 con un carrito vacío', () => {
  assertEqual(calcularSubtotal([]), 0);
});

test('Lanza error si los productos no son un arreglo', () => {
  try {
    calcularSubtotal('cien')
    throw new Error('Debería haber lanzado un error por productos no válidos');
  } catch (e) {
    if (e.message === 'Debería haber lanzado un error por productos no válidos') {
      throw e;
    }
  }
});

test('Lanza error si un producto tiene precio inválido', () => {
  try {
    calcularSubtotal([{ precio: -10, cantidad: 1 }])
    throw new Error('Debería haber lanzado un error por precio inválido');
  } catch (e) {
    if (e.message === 'Debería haber lanzado un error por precio inválido') {
      throw e;
    }
  }
});

test('Lanza error si un producto tiene cantidad inválida', () => {
  try {
    calcularSubtotal([{ precio: 10, cantidad: 0 }])
    throw new Error('Debería haber lanzado un error por cantidad inválida');
  } catch (e) {
    if (e.message === 'Debería haber lanzado un error por cantidad inválida') {
      throw e;
    }
  }
});

// aplicarDescuentoCliente

test('aplicarDescuentoCliente VIP aplica el 15% de descuento', () => {
  assertEqual(aplicarDescuentoCliente(100, 'vip'), 85);
});

test('aplicarDescuentoCliente frecuente aplica el 7% de descuento', () => {
  assertEqual(aplicarDescuentoCliente(100, 'frecuente'), 93);
});

test('aplicarDescuentoCliente normal no altera el subtotal', () => {
  assertEqual(aplicarDescuentoCliente(100, 'normal'), 100);
});

test('Lanza error si el subtotal es negativo', () => {
  try {
    aplicarDescuentoCliente(-100, 'normal')
    throw new Error('Debería haber lanzado un error por subtotal negativo');
  } catch (e) {
    if (e.message === 'Debería haber lanzado un error por subtotal negativo') {
      throw e;
    }
  }
});

test('Lanza error si el tipo de cliente es inválido', () => {
  try {
    aplicarDescuentoCliente(100, 'empleado')
    throw new Error('Debería haber lanzado un error por tipo de cliente inválido');
  } catch (e) {
    if (e.message === 'Debería haber lanzado un error por tipo de cliente inválido') {
      throw e;
    }
  }
});

// calcularTotal (integración)

test('Cliente normal sin bono: solo se aplica el ISV', () => {
  assertEqual(calcularTotal([{ precio: 100, cantidad: 1 }], 'normal'), 115);
});

test('Cliente VIP: descuento del 15% más ISV', () => {
  assertEqual(calcularTotal([{ precio: 100, cantidad: 1 }], 'vip'), 97.75);
});

test('Cliente frecuente: descuento del 7% más ISV', () => {
  assertEqual(calcularTotal([{ precio: 100, cantidad: 1 }], 'frecuente'), 106.95);
});

test('Bono de L. 50 al superar el umbral de L. 500', () => {
  assertEqual(calcularTotal([{ precio: 300, cantidad: 2 }], 'normal'), 632.5);
});

test('Bono aplica al llegar exactamente al umbral', () => {
  assertEqual(calcularTotal([{ precio: 500, cantidad: 1 }], 'normal'), 517.5);
});

test('Sin bono si el subtotal es menor al umbral', () => {
  assertEqual(calcularTotal([{ precio: 499.99, cantidad: 1 }], 'normal'), 574.99);
});
