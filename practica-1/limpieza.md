# Práctica 1: Refactorización y Código Limpio

## 1. Código Original

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


---

```typescript
const ISV_TAX_RATE = 0.15;
const SPECIAL_TAX_RATE = 0.05;
const STANDARD_DISCOUNT_RATE = 0.10;

enum TaxCategory {
  Standard = 1,
  Special = 2,
  Exempt = 0
}

interface Product {
  id: string;
  name: string;
  price: number;
  stock: number;
}

function processProductSale(
  product: Product | null,
  quantity: number,
  applyDiscount: boolean = false,
  taxCategory: TaxCategory = TaxCategory.Standard
): number {
  // Guard Clauses (Eliminan el anidamiento excesivo)
  if (!product) throw new Error("El producto proporcionado no existe.");
  if (quantity <= 0) throw new Error("La cantidad a comprar debe ser mayor a cero.");
  if (product.stock < quantity) throw new Error("Stock insuficiente para realizar la venta.");

  let subtotal = product.price * quantity;

  if (applyDiscount) {
    subtotal -= subtotal * STANDARD_DISCOUNT_RATE;
  }

  if (taxCategory === TaxCategory.Standard) {
    subtotal += subtotal * ISV_TAX_RATE;
  } else if (taxCategory === TaxCategory.Special) {
    subtotal += subtotal * SPECIAL_TAX_RATE;
  }

  product.stock -= quantity;
  return Number(subtotal.toFixed(2));
}
  } else {
    console.log("No producto");
    return -1;

---

```typescript
const ISV_TAX_RATE = 0.15;
const SPECIAL_TAX_RATE = 0.05;
const STANDARD_DISCOUNT_RATE = 0.10;

export enum TaxCategory {
  Standard = 1,
  Special = 2,
  Exempt = 0
}

export interface Product {
  id: string;
  name: string;
  price: number;
  stock: number;
}

/**
 * Procesa la venta de un producto aplicando impuestos y descuentos correspondientes.
 */
export function processProductSale(
  product: Product | null,
  quantity: number,
  applyDiscount: boolean = false,
  taxCategory: TaxCategory = TaxCategory.Standard
): number {
  validateSaleInput(product, quantity);

  let subtotal = product!.price * quantity;

  if (applyDiscount) {
    subtotal -= subtotal * STANDARD_DISCOUNT_RATE;
  }

  const totalAmount = subtotal + calculateTaxAmount(subtotal, taxCategory);

  updateProductStock(product!, quantity);

  return Number(totalAmount.toFixed(2));
}

function validateSaleInput(product: Product | null, quantity: number): void {
  if (!product) {
    throw new Error("El producto proporcionado no existe.");
  }
  if (quantity <= 0) {
    throw new Error("La cantidad a comprar debe ser mayor a cero.");
  }
  if (product.stock < quantity) {
    throw new Error(`Stock insuficiente para ${product.name}. Disponible: ${product.stock}`);
  }
}

function calculateTaxAmount(amount: number, taxCategory: TaxCategory): number {
  switch (taxCategory) {
    case TaxCategory.Standard:
      return amount * ISV_TAX_RATE;
    case TaxCategory.Special:
      return amount * SPECIAL_TAX_RATE;
    default:
      return 0;
  }
}

function updateProductStock(product: Product, quantity: number): void {
  product.stock -= quantity;
}
  }
}
