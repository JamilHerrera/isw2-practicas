

```javascript
class Pedido {
  procesarPedido(pedido) {
    // 1. Validar stock
    for (let i = 0; i < pedido.items.length; i++) {
      let item = pedido.items[i];
      let stockDisponible = baseDeDatos.consultarStock(item.id);
      if (stockDisponible < item.cantidad) {
        throw new Error(`Stock insuficiente para el producto: ${item.nombre}`);
      }
    }

    
    let subtotal = 0;
    for (let i = 0; i < pedido.items.length; i++) {
      subtotal += pedido.items[i].precio * pedido.items[i].cantidad;
    }
    let isv = subtotal * 0.15;
    let total = subtotal + isv;
    pedido.total = total;


    let conexion = baseDeDatos.conectar("mongodb://localhost:27017/db");
    conexion.insertar("pedidos", {
      cliente: pedido.cliente,
      items: pedido.items,
      total: total,
      fecha: new Date()
    });

    
    impresora.inicializar();
    impresora.escribirTexto("=== TICKET DE COMPRA ===");
    impresora.escribirTexto(`Cliente: ${pedido.cliente}`);
    impresora.escribirTexto(`Subtotal: L. ${subtotal}`);
    impresora.escribirTexto(`ISV (15%): L. ${isv}`);
    impresora.escribirTexto(`Total: L. ${total}`);
    impresora.cortarPapel();

    
    let apiWhatsapp = new ServicioWhatsApp("API_KEY_SECRET_12345");
    let mensaje = `Hola ${pedido.cliente}, tu pedido por un total de L. ${total} fue procesado con éxito.`;
    apiWhatsapp.enviarMensaje(pedido.telefonoCliente, mensaje);

    return true;
  }
}
