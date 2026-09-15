#!/usr/bin/env node
// Corre todas las suites de tests del portafolio y agrega el resultado.
//
// Por qué un agregador y no `node a.test.js && node b.test.js`:
// con `&&`, la primera suite que falla corta la cadena y nunca ves el estado
// de las demás. En CI eso significa arreglar un fallo, volver a pushear y
// descubrir el siguiente. Acá corren todas y el resumen dice cuáles fallaron.

const { spawnSync } = require('node:child_process');
const path = require('node:path');

const SUITES = [
  { nombre: 'Práctica 4 · Calculadora de fiados', archivo: 'practica-4/fiados.test.js' },
  { nombre: 'Práctica 5 · Cálculo de totales', archivo: 'practica-5/enfermo.test.js' },
];

const raiz = path.resolve(__dirname, '..');
const resultados = [];

for (const suite of SUITES) {
  console.log(`\n${'='.repeat(64)}`);
  console.log(`▶  ${suite.nombre}  (${suite.archivo})`);
  console.log('='.repeat(64));

  const proceso = spawnSync(process.execPath, [suite.archivo], {
    cwd: raiz,
    stdio: 'inherit',
  });

  // Una suite que no arranca (archivo borrado, error de sintaxis) tiene
  // status null o distinto de 0: ambos casos cuentan como fallo.
  const ok = proceso.status === 0;
  resultados.push({ ...suite, ok, status: proceso.status });
}

console.log(`\n${'='.repeat(64)}`);
console.log('RESUMEN');
console.log('='.repeat(64));

for (const r of resultados) {
  console.log(`${r.ok ? '✅ OK  ' : '❌ FALLO'}  ${r.nombre}${r.ok ? '' : `  (exit ${r.status})`}`);
}

const fallidas = resultados.filter((r) => !r.ok);

if (fallidas.length > 0) {
  console.error(`\n${fallidas.length} de ${resultados.length} suites fallaron.`);
  process.exit(1);
}

console.log(`\n${resultados.length} de ${resultados.length} suites pasaron.`);
