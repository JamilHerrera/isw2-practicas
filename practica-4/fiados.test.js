const { calcularMora } = require('./fiados');


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


console.log('--- Corriendo Tests de Calculadora de Fiados ---\n');


test('Calcular mora con días vencidos (> 0)', () => {
  // Arrange
  const monto = 1000;
  const dias = 5;
  // Act
  const resultado = calcularMora(monto, dias);
  // Assert
  assertEqual(resultado, 50);
});


test('Calcular mora con 0 días vencidos debe ser 0', () => {
  const resultado = calcularMora(500, 0);
  assertEqual(resultado, 0);
});

test('Calcular mora con monto 0 debe ser 0', () => {
  const resultado = calcularMora(0, 10);
  assertEqual(resultado, 0);
});


test('Calcular mora con días negativos debe ser 0', () => {
  const resultado = calcularMora(100, -3);
  assertEqual(resultado, 0);
});


test('Lanza error si el monto es negativo', () => {
  try {
    calcularMora(-100, 5);
    throw new Error('Debería haber lanzado un error por monto negativo');
  } catch (e) {
    if (e.message === 'Debería haber lanzado un error por monto negativo') {
      throw e;
    }
  }
});

test('Lanza error si los días no son un número', () => {
  try {
    calcularMora(100, "cinco");
    throw new Error('Debería haber lanzado un error por días no numéricos');
  } catch (e) {
    if (e.message === 'Debería haber lanzado un error por días no numéricos') {
      throw e;
    }
  }
});
