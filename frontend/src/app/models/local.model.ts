export interface Local {
  id: number;
  idPlaza: number;
  nombre: string;
  categoria: string;
  numeroLocal: string;
  estado: string;
  ventas?: Venta[];
  inventarios?: Inventario[];
}

export interface Inventario {
  id: number;
  idLocal: number;
  idProductoCatalogo: number;
  precioUnitario: number;
  stock: number;
  local?: Local;
  ventaInventarios?: VentaInventario[];
}

export interface Venta {
  id: number;
  idLocal: number;
  fecha: string;
  total: number;
  local?: Local;
  ventaInventarios?: VentaInventario[];
}

export interface VentaInventario {
  id?: number;
  idVenta?: number;
  idInventario: number;
  cantidad: number;
  subtotal?: number;
  venta?: Venta;
  inventario?: Inventario;
}

export interface VentaRequest {
  idLocal: number;
  ventaInventarios: {
    idInventario: number;
    cantidad: number;
  }[];
}

export interface Empleado {
  id: number;
  nombre: string;
  cargo: string;
  localId: number;
}
