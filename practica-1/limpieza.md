# Práctica 1: Refactorización y Código Limpio

## 1. Código Original (Legacy Code)

```javascript
 {
  let x = 0;
  if (p != null && p != undefined) {
    if (c > 0) {
      if (p.stk >= c) {
        let precio = p.prc * c;
        if (desc == true) {
          precio = precio - (precio * 0.10); // 10% descuento
        }
        if (t == 1) {
          precio = precio + (precio * 0.15); // impuesto ISV
        } else if (t == 2) {
          precio = precio + (precio * 0.05); // tarifa especial
        }
        x = precio;
        p.stk = p.stk - c;
        console.log("Venta realizada: " + x);
        return x;
      } else {
        console.log("Error stock");
        return -1;
      }
    } else {
      console.log("Cant invalida");
      return -1;
    }
  } else {
    console.log("No producto");
    return -1;
  }
}
