// Práctica 9: Tests del contrato para calcularMoraConAbono
// Escritos ANTES de la implementación (TDD / M4): definen el comportamiento
// esperado de la nueva función. Se apoyan en la calculadora de fiados de la
// Práctica 4 (./fiados.js) para mantener la misma tasa de mora (5%).

const { calcularMoraConAbono, calcularMora } = require('./fiados');

function assertEqual(actual, esperado) {
  if (actual !== esperado) {
    throw new Error(`Esperado: ${esperado}, pero se obtuvo: ${actual}`);
  }
}

let pasaron = 0;
let fallaron = 0;

function test(nombre, fn) {
  try {
    fn();
    pasaron++;
    console.log(`✅ PASS: ${nombre}`);
  } catch (e) {
    fallaron++;
    console.error(`❌ FAIL: ${nombre}`);
    console.error(`   ${e.message}`);
    process.exitCode = 1;
  }
}

function resumen() {
  console.log(`\n--- Resultado: ${pasaron} pasaron, ${fallaron} fallaron ---`);
}

console.log('--- Corriendo Tests de Abonos Parciales (Práctica 9) ---\n');

// 1. Caso principal: el abono reduce el saldo ANTES de calcular la mora.
//    Deuda 1000, abono 200 -> saldo 800 -> mora = 800 * 0.05 = 40.
test('El abono reduce el saldo antes de calcular la mora', () => {
  const resultado = calcularMoraConAbono(1000, 200, 5);
  assertEqual(resultado, 40);
});

// 2. Un abono de 0 (decisión: 0 es válido) debe comportarse EXACTAMENTE
//    igual que la función original calcularMora, sin caso especial.
test('Un abono de 0 se comporta igual que calcularMora sin abono', () => {
  const conAbonoCero = calcularMoraConAbono(500, 0, 10);
  const sinAbono = calcularMora(500, 10);
  assertEqual(conAbonoCero, sinAbono);
});

// 3. Decisión: un abono mayor a la deuda es un error de captura de datos,
//    no se satura en 0 ni se permite saldo a favor. Debe lanzar.
test('Lanza error si el abono es mayor al monto original', () => {
  try {
    calcularMoraConAbono(100, 150, 5);
    throw new Error('Debería haber lanzado un error por abono excesivo');
  } catch (e) {
    if (e.message === 'Debería haber lanzado un error por abono excesivo') {
      throw e;
    }
  }
});

// 4. Un abono negativo no representa un pago real; debe rechazarse igual
//    que ya se rechaza un monto negativo en calcularMora.
test('Lanza error si el abono es negativo', () => {
  try {
    calcularMoraConAbono(100, -50, 5);
    throw new Error('Debería haber lanzado un error por abono negativo');
  } catch (e) {
    if (e.message === 'Debería haber lanzado un error por abono negativo') {
      throw e;
    }
  }
});

// 5. Caso borde: aunque haya abono parcial, sin días vencidos NO hay mora
//    sobre el saldo restante (el abono no "activa" mora por sí solo).
test('Sin días vencidos, el saldo reducido no genera mora', () => {
  const resultado = calcularMoraConAbono(1000, 300, 0);
  assertEqual(resultado, 0);
});

resumen();
