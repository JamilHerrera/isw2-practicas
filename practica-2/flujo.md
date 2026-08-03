# Práctica 2: Estrategias de Ramificación en Git

## Comparación entre GitFlow y Trunk-Based Development

GitFlow es una estrategia tradicional pensada para proyectos grandes con entregas planificadas. Utiliza múltiples ramas de larga duración (`main`, `develop`, `feature/*`, `release/*`, `hotfix/*`), lo que proporciona un control riguroso pero incrementa la complejidad del historial y genera frecuentes conflictos de integración.

Por otro lado, Trunk-Based Development es un flujo ágil y moderno donde todos los desarrolladores integran sus cambios frecuentemente en una sola rama principal (`main` o `trunk`), utilizando ramas de función (*feature branches*) de corta vida útil (1 a 2 días máximo).

---



Para el desarrollo de una aplicación web como nuestra PWA **PulpeAnalisis, la estrategia ideal es Trunk-Based Development porque es lo que aprendi en este modulo, que para una pagina web es mejor el trunk based. 

### Justificación:
1. Las aplicaciones web requieren iteraciones rápidas y correcciones inmediatas. Trunk-Based facilita que cada cambio validado se despliegue automáticamente a producción en Vercel o Netlify.
2.  Evita acumular ramas desactualizadas durante semanas, eliminando los conflictos masivos al fusionar código.
3.  Mantiene un historial lineal, limpio y fácil de auditar para el equipo de desarrollo.

---
*Práctica realizada para el curso de Ingeniería de Software 2.*
