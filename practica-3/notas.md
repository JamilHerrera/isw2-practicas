### Aplicación de Principio S (Responsabilidad Única)
En el código original, la clase `Pedido` asumía múltiples razones para cambiar: lógica tributaria, almacenamiento, formato de impresión y notificaciones. 
Aplicando el principio S, se separó el cálculo de totales en `CalculadorPedido` y la validación en `ValidadorStock`. 
Ahora cada clase tiene una única responsabilidad y motivo de cambio bien definido. Esto facilita las pruebas unitarias aisladas y evita que fallos en la capa de notificación o base de datos afecten las reglas de negocio principales.

### Aplicación de Principio D (Inversión de Dependencias)
El método original instanciaba directamente las conexiones a la base de datos y la API de WhatsApp, acoplando estrechamente el código a tecnologías específicas. 
Aplicando el principio D, la clase `ServicioPedido` depende de abstracciones inyectadas a través del constructor (`repositorioPedido` y `servicioNotificacion`). 
Esto permite cambiar fácilmente la base de datos o el proveedor de mensajería sin tocar la lógica de procesamiento. Además, posibilita reemplazar estas dependencias por objetos falsos (mocks) durante la ejecución de pruebas automáticas.
