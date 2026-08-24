const { calcularTotal } = require('./enfermo');

function assertEqual(actual, esperado) {
  if (actual !== esperado) {
    throw new Error(`Esperado: ${esperado}, pero se obtuvo: ${actual}`);
  }
}

function test(nombre, fn) {
  try {
    fn();
    console.log(`✅ PASS: ${nombre}`);
  } catch (e) {
    console.error(`❌ FAIL: ${nombre}`);
    console.error(`   ${e.message}`);
  }
}

console.log('--- Corriendo Tests de Cálculo de Totales (Práctica 5) ---');

test('Cliente normal sin bono: solo se aplica el ISV', () => {
  // Arrange
  const monto = 100;
  // Act
  const resultado = calcularTotal(monto, 'normal');
  // Assert: 100 + (100 * 0.15) = 115
  assertEqual(resultado, 115);
});

test('Cliente VIP: descuento del 15% más ISV', () => {
  // 100 * 0.85 = 85 -> 85 + (85 * 0.15) = 97.75
  assertEqual(calcularTotal(100, 'vip'), 97.75);
});

test('Cliente frecuente: descuento del 7% más ISV', () => {
  // 100 * 0.93 = 93 -> 93 + (93 * 0.15) = 106.95
  assertEqual(calcularTotal(100, 'frecuente'), 106.95);
});

test('Bono de L. 50 al superar el umbral de L. 500', () => {
  // 600 - 50 = 550 -> 550 + (550 * 0.15) = 632.5
  assertEqual(calcularTotal(600, 'normal'), 632.5);
});

test('Bono aplica al llegar exactamente al umbral', () => {
  // 500 - 50 = 450 -> 450 + (450 * 0.15) = 517.5
  assertEqual(calcularTotal(500, 'normal'), 517.5);
});

test('Sin bono si el subtotal es menor al umbral', () => {
  // 499.99 + (499.99 * 0.15) = 574.9885 -> redondeado a 574.99
  assertEqual(calcularTotal(499.99, 'normal'), 574.99);
});

test('Lanza error si el monto es negativo', () => {
  try {
    calcularTotal(-100, 'normal');
    throw new Error('Debería haber lanzado un error por monto negativo');
  } catch (e) {
    if (e.message === 'Debería haber lanzado un error por monto negativo') {
      throw e;
    }
  }
});

test('Lanza error si el monto no es un número', () => {
  try {
    calcularTotal('cien', 'normal');
    throw new Error('Debería haber lanzado un error por monto no numérico');
  } catch (e) {
    if (e.message === 'Debería haber lanzado un error por monto no numérico') {
      throw e;
    }
  }
});

test('Lanza error si el tipo de cliente es inválido', () => {
  try {
    calcularTotal(100, 'empleado');
    throw new Error('Debería haber lanzado un error por tipo de cliente inválido');
  } catch (e) {
    if (e.message === 'Debería haber lanzado un error por tipo de cliente inválido') {
      throw e;
    }
  }
});