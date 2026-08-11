javascript
// Principio S: Responsabilidad única para cálculo
class CalculadorPedido {
  calcularTotal(items) {
    const subtotal = items.reduce((acc, item) => acc + (item.precio * item.cantidad), 0);
    const isv = subtotal * 0.15;
    return { subtotal, isv, total: subtotal + isv };
  }
}

// Principio S: Responsabilidad única para validación de stock
class ValidadorStock {
  validar(items, repositorioStock) {
    items.forEach(item => {
      if (repositorioStock.obtenerStock(item.id) < item.cantidad) {
        throw new Error(`Stock insuficiente para: ${item.nombre}`);
      }
    });
  }
}

// Principio D: Abstracciones e inyección de dependencias
class ServicioPedido {
  constructor(validadorStock, calculador, repositorioPedido, servicioNotificacion, servicioImpresion) {
    this.validadorStock = validadorStock;
    this.calculador = calculador;
    this.repositorioPedido = repositorioPedido; // Inyección (D)
    this.servicioNotificacion = servicioNotificacion; // Inyección (D)
    this.servicioImpresion = servicioImpresion;
  }

  procesar(pedido, stockRepo) {
    this.validadorStock.validar(pedido.items, stockRepo);
    
    const { subtotal, isv, total } = this.calculador.calcularTotal(pedido.items);
    pedido.total = total;

    this.repositorioPedido.guardar(pedido);
    this.servicioImpresion.imprimirTicket(pedido, subtotal, isv);
    this.servicioNotificacion.notificar(pedido.telefonoCliente, `Tu pedido de L. ${total} fue procesado.`);

    return pedido;
  }
}
